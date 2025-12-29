-- Migration: users 테이블 생성
-- Date: 2024-12-29
-- Description: Clerk 사용자 정보를 저장하는 자체 users 테이블

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON public.users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON public.users(nickname);

-- RLS 비활성화 (Clerk 인증 사용)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 기존 사용자 마이그레이션 (posts, comments의 user_id에서 추출)
-- 중복 제거하여 users 테이블에 삽입
INSERT INTO public.users (clerk_user_id, nickname)
SELECT DISTINCT user_id, CONCAT('User_', SUBSTRING(user_id, 6, 6))
FROM public.posts
WHERE user_id IS NOT NULL
  AND user_id NOT IN (SELECT clerk_user_id FROM public.users WHERE clerk_user_id IS NOT NULL)
ON CONFLICT (clerk_user_id) DO NOTHING;

INSERT INTO public.users (clerk_user_id, nickname)
SELECT DISTINCT user_id, CONCAT('User_', SUBSTRING(user_id, 6, 6))
FROM public.comments
WHERE user_id IS NOT NULL
  AND user_id NOT IN (SELECT clerk_user_id FROM public.users WHERE clerk_user_id IS NOT NULL)
ON CONFLICT (clerk_user_id) DO NOTHING;

-- 외래 키 추가 (posts.user_id -> users.clerk_user_id)
-- 참고: 외래 키는 optional (SET NULL on delete)
ALTER TABLE public.posts
ADD CONSTRAINT fk_posts_user
FOREIGN KEY (user_id) REFERENCES public.users(clerk_user_id)
ON DELETE SET NULL;

-- 외래 키 추가 (comments.user_id -> users.clerk_user_id)
ALTER TABLE public.comments
ADD CONSTRAINT fk_comments_user
FOREIGN KEY (user_id) REFERENCES public.users(clerk_user_id)
ON DELETE SET NULL;

