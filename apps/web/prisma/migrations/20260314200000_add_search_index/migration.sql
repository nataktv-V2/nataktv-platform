-- Create trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN index on title for trigram similarity search (ILIKE)
CREATE INDEX IF NOT EXISTS videos_title_trgm_idx ON videos USING GIN (title gin_trgm_ops);

-- GIN index on title + description for full-text search (immutable-safe: only text columns)
CREATE INDEX IF NOT EXISTS videos_search_idx ON videos
USING GIN (to_tsvector('english', title || ' ' || description));
