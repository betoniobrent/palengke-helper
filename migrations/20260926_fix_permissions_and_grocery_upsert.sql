-- Run once in the Supabase SQL editor for an existing installation.
-- Transactional: duplicate grocery lists cause the migration to stop without changes.
-- Resolve duplicates explicitly; no existing list data is discarded here.
BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_grocery_lists_user_name ON public.user_grocery_lists(user_id, list_name);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'user') = 'admin';
$$;

-- Profiles: users can only manage their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id AND role = COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'user'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'user'));

-- Admins can view all user profiles for the admin dashboard
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (is_admin());

-- Market prices: anyone can read published prices
DROP POLICY IF EXISTS "Published prices are public" ON public.market_prices;
CREATE POLICY "Published prices are public"
    ON public.market_prices FOR SELECT
    USING (published = true);

-- Market prices: only authenticated admin users can create/update/delete
-- Admins are identified by trusted app_metadata in the signed JWT.
DROP POLICY IF EXISTS "Only admins can insert market prices" ON public.market_prices;
CREATE POLICY "Only admins can insert market prices"
    ON public.market_prices FOR INSERT
    WITH CHECK (
        public.is_admin()
    );

DROP POLICY IF EXISTS "Only admins can update market prices" ON public.market_prices;
CREATE POLICY "Only admins can update market prices"
    ON public.market_prices FOR UPDATE
    USING (
        public.is_admin()
    );

DROP POLICY IF EXISTS "Only admins can delete market prices" ON public.market_prices;
CREATE POLICY "Only admins can delete market prices"
    ON public.market_prices FOR DELETE
    USING (
        public.is_admin()
    );

COMMIT;
