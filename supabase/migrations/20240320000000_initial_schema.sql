-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    photo_url TEXT,
    crew_id UUID REFERENCES crews(id),
    score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create crews table
CREATE TABLE crews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    join_code TEXT UNIQUE NOT NULL,
    leader_id UUID REFERENCES users(id) NOT NULL,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create crew_members junction table
CREATE TABLE crew_members (
    crew_id UUID REFERENCES crews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (crew_id, user_id)
);

-- Create challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_id UUID REFERENCES crews(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('carbon', 'recycling', 'food', 'water')),
    target INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create challenge_submissions table
CREATE TABLE challenge_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    progress INTEGER,
    target INTEGER
);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
WITH user_scores AS (
    SELECT 
        u.id as user_id,
        u.display_name,
        COALESCE(SUM(cs.value), 0) as total_score,
        ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(cs.value), 0) DESC) as position
    FROM users u
    LEFT JOIN challenge_submissions cs ON u.id = cs.user_id
    GROUP BY u.id, u.display_name
)
SELECT 
    user_id,
    display_name,
    position,
    total_score as score,
    COUNT(*) OVER (PARTITION BY total_score) - 1 as tied_with
FROM user_scores;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crews_updated_at
    BEFORE UPDATE ON crews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenge_submissions_updated_at
    BEFORE UPDATE ON challenge_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Crews policies
CREATE POLICY "Anyone can view crews"
    ON crews FOR SELECT
    USING (true);

CREATE POLICY "Crew leaders can update their crews"
    ON crews FOR UPDATE
    USING (auth.uid() = leader_id);

-- Crew members policies
CREATE POLICY "Anyone can view crew members"
    ON crew_members FOR SELECT
    USING (true);

CREATE POLICY "Crew leaders can manage members"
    ON crew_members FOR ALL
    USING (EXISTS (
        SELECT 1 FROM crews
        WHERE id = crew_members.crew_id
        AND leader_id = auth.uid()
    ));

-- Challenges policies
CREATE POLICY "Anyone can view challenges"
    ON challenges FOR SELECT
    USING (true);

CREATE POLICY "Crew leaders can manage challenges"
    ON challenges FOR ALL
    USING (EXISTS (
        SELECT 1 FROM crews
        WHERE id = challenges.crew_id
        AND leader_id = auth.uid()
    ));

-- Challenge submissions policies
CREATE POLICY "Users can view all submissions"
    ON challenge_submissions FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own submissions"
    ON challenge_submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view all achievements"
    ON achievements FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own achievements"
    ON achievements FOR ALL
    USING (auth.uid() = user_id); 