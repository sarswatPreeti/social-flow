-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for Social Flow application
-- Created: 2024-01-01

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_address VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url TEXT,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    following BOOLEAN DEFAULT FALSE
);

-- Create media table for post media
CREATE TABLE IF NOT EXISTS post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video', 'gif')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_address VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0
);

-- Create votes table to track user votes
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_address VARCHAR(255) NOT NULL,
    vote_type VARCHAR(4) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_address)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_address ON posts(author_address);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_post_id ON votes(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_address ON votes(user_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for posts table
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO posts (id, author_address, author_name, author_avatar_url, text, upvotes, downvotes, comments_count, following) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '0xabc12345', 'Boby matter', '/diverse-avatars.png', 'Which car do you prefered?', 2100, 120, 32, false),
    ('550e8400-e29b-41d4-a716-446655440002', '0xdef67890', 'Ola Dealova', '/avatar-b.png', 'How do you define UX with an example?', 1200, 40, 18, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample media for the first post
INSERT INTO post_media (post_id, type, url) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'image', '/car-option-1.png'),
    ('550e8400-e29b-41d4-a716-446655440001', 'image', '/car-option-2.png')
ON CONFLICT DO NOTHING;
