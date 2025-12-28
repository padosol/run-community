-- Migration: bookmarks 테이블 생성
-- Date: 2024-12-27
-- Description: 게시글 저장(북마크) 기능을 위한 테이블

-- bookmarks 테이블 생성
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  UNIQUE(user_id, post_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON public.bookmarks(post_id);

-- RLS 비활성화 (Clerk 인증 사용)
ALTER TABLE public.bookmarks DISABLE ROW LEVEL SECURITY;
