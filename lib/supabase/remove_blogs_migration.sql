-- ==============================================================================
-- Migration: Remove Blog Posts Feature from Database
-- Description: Drops blog_posts table, indexes, and associated security policies
-- ==============================================================================

-- Drop Policies if exist
DROP POLICY IF EXISTS "Public blog posts are viewable by everyone" ON public.blog_posts;

-- Drop Indexes if exist
DROP INDEX IF EXISTS public.idx_blog_slug;

-- Drop Table if exists
DROP TABLE IF EXISTS public.blog_posts CASCADE;
