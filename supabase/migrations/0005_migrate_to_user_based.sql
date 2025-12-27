-- Migration: 익명 커뮤니티 → 달리는 커뮤니티 (회원제 전환)
-- Date: 2025-01-XX
-- Description: 비밀번호 기반 익명 시스템을 Clerk 기반 회원제로 전환

-- 1. Posts 테이블 변경
-- author_nickname, password_hash 제거하고 user_id, title 추가

-- 먼저 기존 데이터가 있다면 백업을 권장합니다
-- ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS user_id_backup text;
-- UPDATE public.posts SET user_id_backup = author_nickname;

-- title 컬럼 추가
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS title text;

-- user_id 컬럼 추가 (Clerk user ID)
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS user_id text;

-- 기존 author_nickname, password_hash 컬럼 제거
-- 주의: 실제 운영 환경에서는 데이터 마이그레이션 후 제거해야 합니다
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS author_nickname;
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS password_hash;

-- user_id에 NOT NULL 제약조건 추가 (기존 데이터가 없는 경우)
-- ALTER TABLE public.posts ALTER COLUMN user_id SET NOT NULL;

-- 2. Comments 테이블 변경
-- author_nickname, password_hash 제거하고 user_id, 대댓글, 이미지, 링크, 좋아요 기능 추가

-- user_id 컬럼 추가
ALTER TABLE public.comments 
  ADD COLUMN IF NOT EXISTS user_id text;

-- parent_comment_id 컬럼 추가 (대댓글 지원)
ALTER TABLE public.comments 
  ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- image_url 컬럼 추가
ALTER TABLE public.comments 
  ADD COLUMN IF NOT EXISTS image_url text;

-- link_url 컬럼 추가
ALTER TABLE public.comments 
  ADD COLUMN IF NOT EXISTS link_url text;

-- link_preview 컬럼 추가 (JSONB 타입으로 링크 미리보기 데이터 저장)
ALTER TABLE public.comments 
  ADD COLUMN IF NOT EXISTS link_preview jsonb;

-- likes 컬럼 추가 (댓글 좋아요 수)
ALTER TABLE public.comments 
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0 NOT NULL;

-- 기존 author_nickname, password_hash 컬럼 제거
-- 주의: 실제 운영 환경에서는 데이터 마이그레이션 후 제거해야 합니다
-- ALTER TABLE public.comments DROP COLUMN IF EXISTS author_nickname;
-- ALTER TABLE public.comments DROP COLUMN IF EXISTS password_hash;

-- 3. Recommendations 테이블 변경
-- user_identifier를 user_id로 변경

-- user_id 컬럼 추가
ALTER TABLE public.recommendations 
  ADD COLUMN IF NOT EXISTS user_id text;

-- 기존 UNIQUE 제약조건 제거 (user_identifier 기반)
ALTER TABLE public.recommendations 
  DROP CONSTRAINT IF EXISTS recommendations_post_id_user_identifier_key;

-- 기존 user_identifier 데이터를 user_id로 마이그레이션 (필요한 경우)
-- UPDATE public.recommendations SET user_id = user_identifier WHERE user_id IS NULL;

-- 새로운 UNIQUE 제약조건 추가 (post_id, user_id)
ALTER TABLE public.recommendations 
  ADD CONSTRAINT recommendations_post_id_user_id_key UNIQUE (post_id, user_id);

-- 기존 user_identifier 컬럼 제거
-- 주의: 실제 운영 환경에서는 데이터 마이그레이션 후 제거해야 합니다
-- ALTER TABLE public.recommendations DROP COLUMN IF EXISTS user_identifier;

-- 4. Comment_likes 테이블 생성 (댓글 좋아요 기록)
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL, -- Clerk user ID
  UNIQUE (comment_id, user_id) -- 댓글당 동일 사용자 중복 좋아요 방지
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id);

