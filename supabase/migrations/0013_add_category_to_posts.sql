-- Add category column to posts table
-- Categories: free (자유게시판), question (질문), info (정보공유), humor (유머)

ALTER TABLE public.posts
ADD COLUMN category TEXT DEFAULT 'free'
CHECK (category IN ('free', 'question', 'info', 'humor'));

-- Index for category filtering
CREATE INDEX idx_posts_category ON public.posts(category);

-- Composite index for category + sorting
CREATE INDEX idx_posts_category_created_at ON public.posts(category, created_at DESC);
CREATE INDEX idx_posts_category_upvotes ON public.posts(category, upvotes DESC);
