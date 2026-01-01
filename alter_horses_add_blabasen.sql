-- Add blabasen_link column to horses table
ALTER TABLE horses 
ADD COLUMN IF NOT EXISTS blabasen_link TEXT;

-- Verify
-- SELECT blabasen_link FROM horses LIMIT 1;
