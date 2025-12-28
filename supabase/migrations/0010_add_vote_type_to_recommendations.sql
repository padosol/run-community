-- Migration: 투표 시스템 개선
-- Date: 2024-12-27
-- Description: upvotes/downvotes 별도 관리

-- recommendations 테이블에 vote_type 컬럼 추가 (1: upvote, -1: downvote)
ALTER TABLE public.recommendations 
  ADD COLUMN IF NOT EXISTS vote_type integer DEFAULT 1;

-- posts 테이블에 upvotes, downvotes 컬럼 추가
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS upvotes integer DEFAULT 0;

ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS downvotes integer DEFAULT 0;

-- 기존 likes 데이터를 upvotes로 마이그레이션
UPDATE public.posts SET upvotes = likes WHERE upvotes IS NULL OR upvotes = 0;

-- 기존 recommendations 데이터는 모두 upvote로 설정
UPDATE public.recommendations SET vote_type = 1 WHERE vote_type IS NULL;
