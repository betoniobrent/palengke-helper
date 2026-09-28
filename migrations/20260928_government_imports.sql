BEGIN;
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS private.price_import_credentials (
    name text PRIMARY KEY, token_hash text NOT NULL, enabled boolean NOT NULL DEFAULT true
);
REVOKE ALL ON private.price_import_credentials FROM PUBLIC, anon, authenticated;
ALTER TABLE private.price_import_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ADD COLUMN IF NOT EXISTS source_agency text NOT NULL DEFAULT 'DA' CHECK(source_agency IN ('DA','DTI'));
ALTER TABLE public.market_prices ADD COLUMN IF NOT EXISTS price_type text NOT NULL DEFAULT 'market' CHECK(price_type IN ('market','srp'));
ALTER TABLE public.market_prices ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE public.market_prices ADD COLUMN IF NOT EXISTS document_sha256 text;
CREATE TABLE IF NOT EXISTS public.price_imports (
    source_agency text NOT NULL CHECK(source_agency IN ('DA','DTI')),
    sha256 text NOT NULL, source_date date NOT NULL, source_url text,
    row_count integer NOT NULL, imported_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(source_agency,sha256)
);
ALTER TABLE public.price_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public import provenance" ON public.price_imports FOR SELECT USING(true);
GRANT SELECT ON public.price_imports TO anon,authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.price_imports FROM anon,authenticated;
CREATE OR REPLACE FUNCTION private.replace_price_batch(rows jsonb, agency text, document_url text, document_hash text, automatic boolean)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
    r jsonb;
    low_price numeric;
    high_price numeric;
    batch_date date;
    batch_region text;
    inserted_count integer;
    previous_count integer;
    latest_date date;
BEGIN
    IF agency IS NULL OR agency NOT IN ('DA','DTI') THEN RAISE EXCEPTION 'Unknown agency'; END IF;
    IF jsonb_typeof(rows) IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'Prices must be an array';
    END IF;
    IF jsonb_array_length(rows) = 0 OR jsonb_array_length(rows) > 2000 THEN
        RAISE EXCEPTION 'Publish between 1 and 2000 reviewed rows';
    END IF;
    FOR r IN SELECT value FROM jsonb_array_elements(rows) LOOP
        IF jsonb_typeof(r) IS DISTINCT FROM 'object'
            OR nullif(btrim(r->>'item_name'), '') IS NULL
            OR nullif(btrim(r->>'unit'), '') IS NULL
            OR nullif(btrim(r->>'region'), '') IS NULL
            OR nullif(r->>'source_date', '') IS NULL
            OR (r->>'category') IS NULL
            OR (r->>'category') NOT IN ('rice','meat','fish','vegetables','fruits','spices','other food','household') THEN
            RAISE EXCEPTION 'Each row needs a name, category, unit, report date, and region';
        END IF;
        low_price := (r->>'price_min')::numeric;
        high_price := (r->>'price_max')::numeric;
        IF (low_price IS NULL) <> (high_price IS NULL)
            OR low_price <= 0 OR high_price <= 0 OR low_price > high_price
            OR low_price::text IN ('NaN','Infinity','-Infinity')
            OR high_price::text IN ('NaN','Infinity','-Infinity') THEN
            RAISE EXCEPTION 'Invalid price range';
        END IF;
        IF batch_date IS NULL THEN
            batch_date := (r->>'source_date')::date;
            batch_region := btrim(r->>'region');
        ELSIF batch_date <> (r->>'source_date')::date OR (agency='DA' AND batch_region <> btrim(r->>'region')) THEN
            RAISE EXCEPTION 'A batch must use one report date and region';
        END IF;
    END LOOP;
    IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(rows) AS entry(value) WHERE entry.value->>'price_min' IS NOT NULL) THEN
        RAISE EXCEPTION 'At least one row must have an available price';
    END IF;
    IF EXISTS (SELECT 1 FROM jsonb_array_elements(rows) AS entry(value)
        GROUP BY lower(btrim(entry.value->>'item_name')), entry.value->>'category', lower(btrim(entry.value->>'unit')), lower(btrim(entry.value->>'region')) HAVING count(*) > 1) THEN
        RAISE EXCEPTION 'Duplicate commodities in batch';
    END IF;
    PERFORM pg_advisory_xact_lock(620260927);
    IF document_hash IS NOT NULL AND document_hash !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid document hash'; END IF;
    IF automatic THEN
        IF document_hash IS NULL OR document_url IS NULL OR NOT (
            (agency='DA' AND document_url ~ '^https://www\.da\.gov\.ph/[^ ]+\.pdf([?][^ ]*)?$') OR
            (agency='DTI' AND document_url ~ '^https://(www\.dti\.gov\.ph|dtiwebfiles\.s3[.-]ap-southeast-1\.amazonaws\.com)/[^ ]+\.pdf([?][^ ]*)?$')
        ) THEN RAISE EXCEPTION 'Official PDF URL and hash required'; END IF;
        IF batch_date > (now() AT TIME ZONE 'Asia/Manila')::date THEN RAISE EXCEPTION 'Future report'; END IF;
        IF jsonb_array_length(rows) < (CASE WHEN agency='DA' THEN 50 ELSE 100 END) THEN RAISE EXCEPTION 'Incomplete report'; END IF;
        IF agency='DTI' AND EXISTS (SELECT 1 FROM jsonb_array_elements(rows) e WHERE (e->>'price_min') IS NULL OR (e->>'price_min')::numeric <> (e->>'price_max')::numeric) THEN RAISE EXCEPTION 'DTI requires one SRP per product'; END IF;
        IF EXISTS (SELECT 1 FROM public.price_imports i WHERE i.source_agency=agency AND i.sha256=document_hash) THEN RETURN 0; END IF;
        SELECT count(*),max(source_date) INTO previous_count,latest_date FROM public.market_prices WHERE published AND source_agency=agency;
        IF batch_date < latest_date THEN RETURN 0; END IF;
        IF previous_count > 0 AND (jsonb_array_length(rows) < previous_count*0.8 OR jsonb_array_length(rows) > previous_count*1.25) THEN RAISE EXCEPTION 'Unexpected report size change; manual review required'; END IF;
        IF EXISTS (
            SELECT 1 FROM public.market_prices p JOIN jsonb_array_elements(rows) e
            ON lower(p.item_name)=lower(btrim(e->>'item_name')) AND p.unit=btrim(e->>'unit') AND p.region=btrim(e->>'region')
            WHERE p.published AND p.source_agency=agency AND p.price_min > 0
            AND ((e->>'price_min')::numeric < p.price_min*0.5 OR (e->>'price_max')::numeric > p.price_max*1.5)
        ) THEN RAISE EXCEPTION 'Large price change; manual review required'; END IF;
    END IF;
    UPDATE public.market_prices SET published=false WHERE published AND source_agency=agency;
    INSERT INTO public.market_prices
        (source_date, item_name, category, unit, price_min, price_max, region, notes, published, published_at, created_by, source_agency, price_type, source_url, document_sha256)
    SELECT (entry.value->>'source_date')::date, btrim(entry.value->>'item_name'), entry.value->>'category', btrim(entry.value->>'unit'),
        (entry.value->>'price_min')::numeric, (entry.value->>'price_max')::numeric, btrim(entry.value->>'region'),
        entry.value->>'notes', true, now(), auth.uid(), agency, CASE WHEN agency='DTI' THEN 'srp' ELSE 'market' END, document_url, document_hash
    FROM jsonb_array_elements(rows) AS entry(value);
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    IF document_hash IS NOT NULL THEN
        INSERT INTO public.price_imports(source_agency,sha256,source_date,source_url,row_count)
        VALUES(agency,document_hash,batch_date,document_url,inserted_count)
        ON CONFLICT(source_agency,sha256) DO NOTHING;
    END IF;
    RETURN inserted_count;
END;
$$;
REVOKE ALL ON FUNCTION private.replace_price_batch(jsonb,text,text,text,boolean) FROM PUBLIC,anon,authenticated;
DROP FUNCTION public.publish_market_prices(jsonb);
CREATE FUNCTION public.publish_market_prices(rows jsonb, agency text DEFAULT 'DA', document_url text DEFAULT NULL, document_hash text DEFAULT NULL)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
    IF auth.uid() IS NULL OR NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501'; END IF;
    RETURN private.replace_price_batch(rows,agency,document_url,document_hash,false);
END;
$$;
REVOKE ALL ON FUNCTION public.publish_market_prices(jsonb,text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.publish_market_prices(jsonb,text,text,text) TO authenticated;
CREATE FUNCTION public.publish_government_prices(import_token text, agency text, document_url text, document_hash text, rows jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
    IF import_token IS NULL OR NOT EXISTS (
        SELECT 1 FROM private.price_import_credentials WHERE name='government-import' AND enabled
        AND token_hash=encode(sha256(convert_to(import_token,'UTF8')),'hex')
    ) THEN RAISE EXCEPTION 'Invalid import credential' USING ERRCODE='42501'; END IF;
    RETURN private.replace_price_batch(rows,agency,document_url,document_hash,true);
END;
$$;
REVOKE ALL ON FUNCTION public.publish_government_prices(text,text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_government_prices(text,text,text,text,jsonb) TO anon;
NOTIFY pgrst, 'reload schema';
COMMIT;
