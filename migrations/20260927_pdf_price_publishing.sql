BEGIN;

-- Replace the existing publisher with a validated, atomic batch replacement.
CREATE OR REPLACE FUNCTION public.publish_market_prices(rows jsonb)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    r jsonb;
    low_price numeric;
    high_price numeric;
    batch_date date;
    batch_region text;
    inserted_count integer;
BEGIN
    IF auth.uid() IS NULL OR NOT public.is_admin() THEN
        RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
    END IF;
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
        ELSIF batch_date <> (r->>'source_date')::date OR batch_region <> btrim(r->>'region') THEN
            RAISE EXCEPTION 'A batch must use one report date and region';
        END IF;
    END LOOP;
    IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(rows) AS entry(value) WHERE entry.value->>'price_min' IS NOT NULL) THEN
        RAISE EXCEPTION 'At least one row must have an available price';
    END IF;
    IF EXISTS (SELECT 1 FROM jsonb_array_elements(rows) AS entry(value)
        GROUP BY lower(btrim(entry.value->>'item_name')), entry.value->>'category', lower(btrim(entry.value->>'unit')) HAVING count(*) > 1) THEN
        RAISE EXCEPTION 'Duplicate commodities in batch';
    END IF;
    PERFORM pg_advisory_xact_lock(620260927);
    UPDATE public.market_prices SET published = false WHERE published = true;
    INSERT INTO public.market_prices
        (source_date, item_name, category, unit, price_min, price_max, region, notes, published, published_at, created_by)
    SELECT (entry.value->>'source_date')::date, btrim(entry.value->>'item_name'), entry.value->>'category', btrim(entry.value->>'unit'),
        (entry.value->>'price_min')::numeric, (entry.value->>'price_max')::numeric, btrim(entry.value->>'region'),
        entry.value->>'notes', true, now(), auth.uid()
    FROM jsonb_array_elements(rows) AS entry(value);
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    RETURN inserted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.publish_market_prices(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publish_market_prices(jsonb) TO authenticated;
COMMIT;
