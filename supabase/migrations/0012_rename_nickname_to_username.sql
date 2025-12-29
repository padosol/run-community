-- Migration: nickname 컬럼을 username으로 변경
-- Date: 2024-12-29
-- Description: users 테이블의 nickname 컬럼명을 username으로 변경

-- 컬럼명 변경
ALTER TABLE public.users 
RENAME COLUMN nickname TO username;

-- 인덱스 재생성 (기존 인덱스 삭제 후 새 이름으로 생성)
DROP INDEX IF EXISTS idx_users_nickname;
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

