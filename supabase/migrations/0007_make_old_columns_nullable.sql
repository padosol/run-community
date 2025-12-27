-- Migration: 기존 컬럼들을 nullable로 변경
-- Date: 2025-01-XX
-- Description: 회원제 전환 과정에서 author_nickname, password_hash 컬럼을 nullable로 변경

-- Posts 테이블: author_nickname, password_hash를 nullable로 변경
ALTER TABLE public.posts ALTER COLUMN author_nickname DROP NOT NULL;
ALTER TABLE public.posts ALTER COLUMN password_hash DROP NOT NULL;

-- Comments 테이블: author_nickname, password_hash를 nullable로 변경
ALTER TABLE public.comments ALTER COLUMN author_nickname DROP NOT NULL;
ALTER TABLE public.comments ALTER COLUMN password_hash DROP NOT NULL;

-- 참고: 나중에 데이터 마이그레이션이 완료되면 이 컬럼들을 완전히 제거할 수 있습니다:
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS author_nickname;
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS password_hash;
-- ALTER TABLE public.comments DROP COLUMN IF EXISTS author_nickname;
-- ALTER TABLE public.comments DROP COLUMN IF EXISTS password_hash;

