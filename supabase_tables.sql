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
