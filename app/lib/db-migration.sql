-- Add image_url column to players table if it doesn't exist
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS image_url TEXT; 