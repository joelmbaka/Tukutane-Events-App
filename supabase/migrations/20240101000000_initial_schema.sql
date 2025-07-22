-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    category_id UUID,
    image_url TEXT
);

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event_id UUID,
    status TEXT CHECK (status IN ('going', 'maybe', 'not_going')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Add foreign key constraints
ALTER TABLE events
ADD CONSTRAINT fk_events_categories
FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE rsvps
ADD CONSTRAINT fk_rsvps_users
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE rsvps
ADD CONSTRAINT fk_rsvps_events
FOREIGN KEY (event_id) REFERENCES events(id);

-- Create indexes for faster queries
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_rsvps_user ON rsvps(user_id);
