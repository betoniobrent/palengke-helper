-- ==========================================
-- Palengke Helper+ - Supabase Database Schema
-- User Data Persistence Tables with RLS
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USER BUDGETS TABLE
-- Stores monthly budget records with income and expenses
-- ==========================================

CREATE TABLE user_budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month_code TEXT NOT NULL, -- Format: YYYY-MM (e.g., "2024-01")
    income_list JSONB DEFAULT '[]'::jsonb, -- Array of income items
    expense_list JSONB DEFAULT '[]'::jsonb, -- Array of expense items
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one budget per month per user
    UNIQUE(user_id, month_code)
);

-- Create index for faster queries
CREATE INDEX idx_user_budgets_user_id ON user_budgets(user_id);
CREATE INDEX idx_user_budgets_month_code ON user_budgets(month_code);

-- ==========================================
-- 2. USER MEAL PLANS TABLE
-- Stores saved meal plans with recipes
-- ==========================================

CREATE TABLE user_meal_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    weekly_plan JSONB NOT NULL, -- Structure: { "Monday": { "Breakfast": {...}, "Lunch": {...}, "Dinner": {...} }, ... }
    target_budget DECIMAL(10, 2),
    target_pax INTEGER,
    total_cost DECIMAL(10, 2),
    diet_preference TEXT DEFAULT 'anything', -- anything, tipid, healthy, protein, nopork
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_meal_plans_user_id ON user_meal_plans(user_id);
CREATE INDEX idx_user_meal_plans_created_at ON user_meal_plans(created_at DESC);

-- ==========================================
-- 3. USER GROCERY LISTS TABLE
-- Stores grocery items for shopping
-- ==========================================

CREATE TABLE user_grocery_lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    list_name TEXT DEFAULT 'Default List',
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of items: [{ name, price, quantity, category, checked }]
    total_cost DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_grocery_lists_user_id ON user_grocery_lists(user_id);
CREATE INDEX idx_user_grocery_lists_created_at ON user_grocery_lists(created_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE user_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_grocery_lists ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES FOR USER_BUDGETS
-- ==========================================

-- Users can only read their own budgets
CREATE POLICY "Users can view own budgets"
    ON user_budgets FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own budgets
CREATE POLICY "Users can insert own budgets"
    ON user_budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own budgets
CREATE POLICY "Users can update own budgets"
    ON user_budgets FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own budgets
CREATE POLICY "Users can delete own budgets"
    ON user_budgets FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- RLS POLICIES FOR USER_MEAL_PLANS
-- ==========================================

-- Users can only read their own meal plans
CREATE POLICY "Users can view own meal plans"
    ON user_meal_plans FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own meal plans
CREATE POLICY "Users can insert own meal plans"
    ON user_meal_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own meal plans
CREATE POLICY "Users can update own meal plans"
    ON user_meal_plans FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own meal plans
CREATE POLICY "Users can delete own meal plans"
    ON user_meal_plans FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- RLS POLICIES FOR USER_GROCERY_LISTS
-- ==========================================

-- Users can only read their own grocery lists
CREATE POLICY "Users can view own grocery lists"
    ON user_grocery_lists FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own grocery lists
CREATE POLICY "Users can insert own grocery lists"
    ON user_grocery_lists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own grocery lists
CREATE POLICY "Users can update own grocery lists"
    ON user_grocery_lists FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own grocery lists
CREATE POLICY "Users can delete own grocery lists"
    ON user_grocery_lists FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- AUTOMATIC UPDATED_AT TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_user_budgets_updated_at
    BEFORE UPDATE ON user_budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_meal_plans_updated_at
    BEFORE UPDATE ON user_meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_grocery_lists_updated_at
    BEFORE UPDATE ON user_grocery_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SAMPLE DATA STRUCTURES FOR REFERENCE
-- ==========================================

-- user_budgets income_list structure:
-- [
--   {
--     "id": "income_1",
--     "description": "Salary",
--     "amount": 25000,
--     "specCadence": "monthly",
--     "date": "2024-01-15"
--   }
-- ]

-- user_budgets expense_list structure:
-- [
--   {
--     "id": "expense_1",
--     "description": "Groceries",
--     "amount": 5000,
--     "category": "food",
--     "date": "2024-01-10"
--   }
-- ]

-- user_meal_plans weekly_plan structure:
-- {
--   "Monday": {
--     "Breakfast": { "id": 1, "name": "Silog", "estimatedCost": 150, ... },
--     "Lunch": { "id": 2, "name": "Adobo", "estimatedCost": 200, ... },
--     "Dinner": { "id": 3, "name": "Sinigang", "estimatedCost": 180, ... }
--   },
--   "Tuesday": { ... },
--   ...
-- }

-- user_grocery_lists items structure:
-- [
--   {
--     "id": "item_1",
--     "name": "Bangus",
--     "price": 120,
--     "quantity": 2,
--     "category": "fish",
--     "checked": false
--   }
-- ]

-- ==========================================
-- 4. PROFILES TABLE
-- Extra data per user linked to auth.users
-- ==========================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INTEGER,
    address TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_id ON profiles(id);

-- ==========================================
-- 5. MARKET PRICES TABLE
-- Stores published and draft market prices from DA / manual overrides
-- ==========================================

CREATE TABLE market_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_date DATE NOT NULL,           -- Date the price data is for (e.g. DA Bantay Presyo date)
    item_name TEXT NOT NULL,             -- e.g. "Bangus", "Bigas (NFA)", "Itlog (medium)"
    category TEXT NOT NULL CHECK (category IN (
        'rice', 'meat', 'fish', 'vegetables', 'fruits', 'spices', 'other food', 'household'
    )),
    unit TEXT NOT NULL,                  -- e.g. "kg", "pc", "tray", "litro"
    price_min DECIMAL(10, 2),            -- Lowest observed price
    price_max DECIMAL(10, 2),            -- Highest observed price
    price_avg DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE
            WHEN price_min IS NOT NULL AND price_max IS NOT NULL THEN (price_min + price_max) / 2
            WHEN price_min IS NOT NULL THEN price_min
            WHEN price_max IS NOT NULL THEN price_max
            ELSE NULL
        END
    ) STORED,
    region TEXT DEFAULT 'NCR',           -- Optional: region the price applies to
    notes TEXT,                          -- Manual override notes, e.g. "Palengke price higher than DA"
    published BOOLEAN DEFAULT false,     -- false = admin draft, true = visible to users
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_market_prices_published ON market_prices(published);
CREATE INDEX idx_market_prices_category ON market_prices(category);
CREATE INDEX idx_market_prices_source_date ON market_prices(source_date DESC);
CREATE INDEX idx_market_prices_item_name ON market_prices(item_name);

-- View for users: only published latest prices per item/category
CREATE OR REPLACE VIEW latest_market_prices AS
SELECT DISTINCT ON (item_name, category)
    id,
    source_date,
    item_name,
    category,
    unit,
    price_min,
    price_max,
    price_avg,
    region,
    notes,
    published_at,
    created_at
FROM market_prices
WHERE published = true
ORDER BY item_name, category, source_date DESC, published_at DESC;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only manage their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Market prices: anyone can read published prices
CREATE POLICY "Published prices are public"
    ON market_prices FOR SELECT
    USING (published = true);

-- Market prices: only authenticated admin users can create/update/delete
-- Admins are identified by app_metadata role = 'admin' set via Supabase Dashboard or edge function
CREATE POLICY "Only admins can insert market prices"
    ON market_prices FOR INSERT
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Only admins can update market prices"
    ON market_prices FOR UPDATE
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Only admins can delete market prices"
    ON market_prices FOR DELETE
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Create triggers for new tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_prices_updated_at
    BEFORE UPDATE ON market_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
