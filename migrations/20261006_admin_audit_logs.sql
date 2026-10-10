BEGIN;
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 occurred_at timestamptz NOT NULL DEFAULT now(),
 actor_id uuid,
 action text NOT NULL,
 details jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.admin_audit_logs TO authenticated;
CREATE POLICY admin_audit_read ON public.admin_audit_logs FOR SELECT TO authenticated
 USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');
CREATE INDEX IF NOT EXISTS admin_audit_recent ON public.admin_audit_logs (occurred_at DESC, id DESC);
CREATE OR REPLACE FUNCTION private.audit_price_insert() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.admin_audit_logs(actor_id,action,details)
 SELECT auth.uid(), 'prices_published', jsonb_build_object('agency',source_agency,'report_date',source_date,'row_count',count(*),'region',region)
 FROM inserted_prices WHERE published GROUP BY source_agency,source_date,region;
 RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION private.audit_price_insert() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS audit_price_publish ON public.market_prices;
CREATE TRIGGER audit_price_publish AFTER INSERT ON public.market_prices
 REFERENCING NEW TABLE AS inserted_prices FOR EACH STATEMENT EXECUTE FUNCTION private.audit_price_insert();
CREATE OR REPLACE FUNCTION private.audit_profile_role() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF OLD.role IS DISTINCT FROM NEW.role THEN
 INSERT INTO public.admin_audit_logs(actor_id,action,details) VALUES(auth.uid(),'role_changed',jsonb_build_object('user_id',NEW.id,'previous_role',OLD.role,'new_role',NEW.role));
 END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.audit_profile_role() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS audit_profile_role ON public.profiles;
CREATE TRIGGER audit_profile_role AFTER UPDATE OF role ON public.profiles FOR EACH ROW EXECUTE FUNCTION private.audit_profile_role();
COMMIT;
