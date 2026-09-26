-- Integration checks: all test publications are rolled back, never made live.
BEGIN;
DO $$
DECLARE admin_id uuid; before_count integer; result_count integer; rejected boolean;
BEGIN
    SELECT id INTO admin_id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin' LIMIT 1;
    IF admin_id IS NULL THEN RAISE EXCEPTION 'No existing admin account available for verification'; END IF;
    SELECT count(*) INTO before_count FROM public.market_prices WHERE published;
    PERFORM set_config('request.jwt.claims', jsonb_build_object('sub',admin_id,'app_metadata',jsonb_build_object('role','user'))::text,true);
    rejected := false;
    BEGIN
        PERFORM public.publish_market_prices('[]'::jsonb);
    EXCEPTION WHEN insufficient_privilege THEN rejected := true;
    END;
    IF NOT rejected THEN RAISE EXCEPTION 'Non-admin authorization failed'; END IF;
    PERFORM set_config('request.jwt.claims', jsonb_build_object('sub',admin_id,'app_metadata',jsonb_build_object('role','admin'))::text,true);
    rejected := false;
    BEGIN
        PERFORM public.publish_market_prices('[]'::jsonb);
    EXCEPTION WHEN raise_exception THEN rejected := true;
    END;
    IF NOT rejected THEN RAISE EXCEPTION 'Empty batch validation failed'; END IF;
    IF (SELECT count(*) FROM public.market_prices WHERE published) <> before_count THEN RAISE EXCEPTION 'Invalid batch changed live prices'; END IF;
    result_count := public.publish_market_prices('[{"item_name":"Migration verification only","category":"fish","unit":"kg","price_min":100,"price_max":120,"source_date":"2026-09-26","region":"Verification only"}]');
    IF result_count <> 1 OR (SELECT count(*) FROM public.market_prices WHERE published) <> 1 THEN RAISE EXCEPTION 'Atomic replacement failed'; END IF;
    rejected := false;
    BEGIN
        PERFORM public.publish_market_prices('[{"item_name":"Overflow verification only","category":"fish","unit":"kg","price_min":999999999999,"price_max":999999999999,"source_date":"2026-09-26","region":"Verification only"}]');
    EXCEPTION WHEN numeric_value_out_of_range THEN rejected := true;
    END;
    IF NOT rejected OR (SELECT count(*) FROM public.market_prices WHERE published) <> 1 THEN RAISE EXCEPTION 'Failed insert did not preserve previous batch'; END IF;
END;
$$;
ROLLBACK;
SELECT 'PASS: authorization, validation, atomic publish and failure rollback; test data rolled back' AS verification;
