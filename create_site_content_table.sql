-- Create a table to store dynamic site content
-- id: A unique key for the page/section (e.g., 'about_page', 'connemara_page')
-- content: A JSONB object storing all text and image URLs for that section
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Policy to allow anyone to read content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON site_content
  FOR SELECT USING (true);

-- Policy to allow authenticated admins to update content (assuming all authenticated users are admins for now)
CREATE POLICY "Allow authenticated update access" ON site_content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert access" ON site_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Initial Seed Data (Optional, but good for structure)
INSERT INTO site_content (id, content)
VALUES 
  ('about_page', '{
    "history_text": "StallMB grundades ur en livslång kärlek till hästar...", 
    "history_image": "", 
    "philosophy_image": ""
  }'),
  ('connemara_page', '{
    "origin_image": "",
    "character_image": "",
    "usage_image": ""
  }')
ON CONFLICT (id) DO NOTHING;
