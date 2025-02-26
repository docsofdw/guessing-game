# Database Migration

This directory contains database migration files for the NFL College Guessing Game.

## Adding the image_url Column

To add the `image_url` column to the `players` table in your Supabase database:

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `db-migration.sql` into the query editor
5. Run the query

This will add the `image_url` column to the `players` table, which is used to store cached player images from TheSportsDB API.

## Player Images Implementation

The `playerImages.ts` file contains a utility function for fetching player images from TheSportsDB API. This function is used by the GameContainer component to display player images in the game.

Key features:
- Fetches player images from TheSportsDB API (free tier)
- Handles rate limits and errors
- Caches image URLs in the database to reduce API calls
- Provides a fallback UI when images are not available 