BEGIN;
DO $$
DECLARE
    da jsonb;
    dti jsonb;
    changed jsonb;
    n integer;
    rejected boolean;
    token text := 'transaction-only-verification-token';
BEGIN
    INSERT INTO private.price_import_credentials(name,token_hash) VALUES('government-import',encode(sha256(convert_to(token,'UTF8')),'hex'))
    ON CONFLICT(name) DO UPDATE SET token_hash=excluded.token_hash,enabled=true;
    SELECT jsonb_agg(jsonb_build_object('item_name','Verification DA '||i,'category','fish','unit','kg','price_min',100,'price_max',100,'source_date','2026-09-27','region','NCR')) INTO da FROM generate_series(1,100) i;
    SELECT jsonb_agg(jsonb_build_object('item_name','Verification DTI '||i,'category','household','unit','100g','price_min',20,'price_max',20,'source_date','2026-05-11','region',CASE WHEN i=1 THEN 'Luzon' ELSE 'Nationwide' END)) INTO dti FROM generate_series(1,167) i;
    PERFORM private.replace_price_batch(da,'DA',NULL,NULL,false);
    PERFORM private.replace_price_batch(dti,'DTI',NULL,NULL,false);
    IF (SELECT count(*) FROM public.market_prices WHERE published) <> 267 THEN RAISE EXCEPTION 'Agency separation failed'; END IF;
    rejected:=false;
    BEGIN
        PERFORM public.publish_government_prices('wrong','DTI','https://www.dti.gov.ph/test.pdf',repeat('a',64),dti);
    EXCEPTION WHEN insufficient_privilege THEN rejected:=true;
    END;
    IF NOT rejected THEN RAISE EXCEPTION 'Bad token accepted'; END IF;
    n:=public.publish_government_prices(token,'DTI','https://www.dti.gov.ph/test.pdf',repeat('a',64),dti);
    IF n<>167 THEN RAISE EXCEPTION 'Automatic publish failed'; END IF;
    n:=public.publish_government_prices(token,'DTI','https://www.dti.gov.ph/test.pdf',repeat('a',64),dti);
    IF n<>0 THEN RAISE EXCEPTION 'Idempotency failed'; END IF;
    changed:=jsonb_set(dti,'{0,price_max}','999');
    rejected:=false;
    BEGIN
        PERFORM public.publish_government_prices(token,'DTI','https://www.dti.gov.ph/test.pdf',repeat('b',64),changed);
    EXCEPTION WHEN raise_exception THEN rejected:=true;
    END;
    IF NOT rejected THEN RAISE EXCEPTION 'Invalid SRP accepted'; END IF;
    rejected:=false;
    BEGIN
        PERFORM public.publish_government_prices(token,'DA','https://evil.example/test.pdf',repeat('c',64),da);
    EXCEPTION WHEN raise_exception THEN rejected:=true;
    END;
    IF NOT rejected THEN RAISE EXCEPTION 'Untrusted URL accepted'; END IF;
    IF (SELECT count(*) FROM public.market_prices WHERE published AND source_agency='DA')<>100 OR
       (SELECT count(*) FROM public.market_prices WHERE published AND source_agency='DTI')<>167 THEN RAISE EXCEPTION 'Failed import modified prices'; END IF;
    IF has_function_privilege('anon','private.replace_price_batch(jsonb,text,text,text,boolean)','execute') THEN RAISE EXCEPTION 'Private publisher exposed'; END IF;
END;
$$;
ROLLBACK;
SELECT 'PASS: source isolation, scoped credential, automatic publishing, idempotency and failure preservation; test changes rolled back' AS verification;
