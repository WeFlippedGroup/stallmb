-- Add images column to horses table to store multiple image URLs
ALTER TABLE horses 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Optional: Migrate existing image_url to the new images array for existing records
-- UPDATE horses SET images = ARRAY[image_url] WHERE image_url IS NOT NULL AND images IS NULL;
