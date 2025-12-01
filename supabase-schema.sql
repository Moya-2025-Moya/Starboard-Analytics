-- Starboard Analytics Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE protocol_stage AS ENUM ('seed', 'series-a', 'series-b', 'pre-tge', 'tge');
CREATE TYPE category AS ENUM ('defi', 'infrastructure', 'gaming', 'nft', 'dao', 'layer1', 'layer2', 'other');
CREATE TYPE grade_level AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Protocols table
CREATE TABLE protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    category category NOT NULL,
    stage protocol_stage NOT NULL,
    risk_level risk_level NOT NULL,
    total_raised_usd BIGINT DEFAULT 0,
    lead_investors TEXT[] DEFAULT '{}',
    founding_team_grade grade_level DEFAULT 'A',
    vc_track_record_grade grade_level DEFAULT 'A',
    business_model_grade grade_level DEFAULT 'A',
    strategy_forecast TEXT,
    expected_tge_date DATE,
    website_url TEXT,
    twitter_url TEXT,
    discord_url TEXT,
    short_description TEXT NOT NULL,
    detailed_analysis TEXT,
    entry_strategy TEXT,
    exit_strategy TEXT,
    risk_factors TEXT[],
    key_metrics JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    expected_costs DECIMAL(10,2) DEFAULT 30,
    tasks TEXT[] DEFAULT ARRAY['Daily Check-in', 'Staking', 'Social Tasks'],
    chains TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_subscribed BOOLEAN DEFAULT false,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_protocols_ranking ON protocols(ranking_score DESC);
CREATE INDEX idx_protocols_category ON protocols(category);
CREATE INDEX idx_protocols_stage ON protocols(stage);
CREATE INDEX idx_protocols_risk_level ON protocols(risk_level);
CREATE INDEX idx_protocols_featured ON protocols(is_featured) WHERE is_featured = true;
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Protocols: Everyone can read basic info
CREATE POLICY "Protocols are viewable by everyone"
    ON protocols FOR SELECT
    USING (true);

-- Protocols: Admins can insert protocols
CREATE POLICY "Admins can insert protocols"
    ON protocols FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Protocols: Admins can update protocols
CREATE POLICY "Admins can update protocols"
    ON protocols FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Protocols: Admins can delete protocols
CREATE POLICY "Admins can delete protocols"
    ON protocols FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Protocols: Only authenticated users can see detailed analysis
CREATE POLICY "Detailed analysis for subscribers only"
    ON protocols FOR SELECT
    USING (
        auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_subscribed = true
        )
    );

-- Users: Users can only view their own data
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users: Users can update their own data
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Subscriptions: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Users: Admins can view all users
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Users: Admins can update all users
CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Subscriptions: Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
    ON subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Subscriptions: Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
    ON subscriptions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Trigger for protocols last_updated
CREATE TRIGGER update_protocols_last_updated
    BEFORE UPDATE ON protocols
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, is_subscribed, subscription_tier, role)
    VALUES (NEW.id, NEW.email, false, 'free', 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscriptions updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO protocols (
    name,
    category,
    stage,
    risk_level,
    total_raised_usd,
    lead_investors,
    founding_team_grade,
    vc_track_record_grade,
    business_model_grade,
    short_description,
    detailed_analysis,
    is_featured
) VALUES
(
    'Aethir Network',
    'infrastructure',
    'series-a',
    'low',
    25000000,
    ARRAY['Framework Ventures', 'Hashkey Capital'],
    'A',
    'B',
    'A',
    'Decentralized GPU cloud computing infrastructure for AI and gaming',
    'Strong founding team with deep enterprise GPU experience. Framework Ventures has 3 successful gaming infra exits. Business model validated through enterprise partnerships.',
    true
),
(
    'Berachain',
    'layer1',
    'series-b',
    'medium',
    42000000,
    ARRAY['Polychain Capital', 'Hack VC'],
    'A',
    'A',
    'B',
    'EVM-compatible L1 with novel Proof-of-Liquidity consensus',
    'Experienced team from previous DeFi protocols. Polychain track record strong but PoL mechanism untested at scale.',
    true
),
(
    'Initia',
    'layer1',
    'seed',
    'high',
    7500000,
    ARRAY['Delphi Digital', 'Nascent'],
    'B',
    'B',
    'C',
    'Modular blockchain network with enshrined liquidity layer',
    'Early-stage with ambitious technical roadmap. Team has Cosmos experience but execution risk remains high.',
    false
);
