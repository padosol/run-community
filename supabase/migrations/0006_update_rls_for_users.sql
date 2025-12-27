-- Migration: RLS 정책 업데이트 (인증 기반 접근 제어)
-- Date: 2025-01-XX
-- Description: 비밀번호 기반 정책을 Clerk 인증 기반 정책으로 변경

-- 기존 RLS 정책 제거
-- Posts 테이블 정책 제거
DROP POLICY IF EXISTS "posts_select_policy" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_policy" ON public.posts;
DROP POLICY IF EXISTS "posts_update_deny" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_deny" ON public.posts;

-- Comments 테이블 정책 제거
DROP POLICY IF EXISTS "comments_select_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_update_deny" ON public.comments;
DROP POLICY IF EXISTS "comments_delete_deny" ON public.comments;

-- Recommendations 테이블 정책 제거
DROP POLICY IF EXISTS "recommendations_select_policy" ON public.recommendations;
DROP POLICY IF EXISTS "recommendations_insert_policy" ON public.recommendations;
DROP POLICY IF EXISTS "recommendations_update_deny" ON public.recommendations;
DROP POLICY IF EXISTS "recommendations_delete_deny" ON public.recommendations;

-- Reports 테이블 정책 제거
DROP POLICY IF EXISTS "reports_select_deny" ON public.reports;
DROP POLICY IF EXISTS "reports_insert_policy" ON public.reports;
DROP POLICY IF EXISTS "reports_update_deny" ON public.reports;
DROP POLICY IF EXISTS "reports_delete_deny" ON public.reports;

-- Comment_likes 테이블에 RLS 활성화
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 새로운 RLS 정책 생성 (인증 기반)
-- ============================================

-- Posts 테이블 정책
-- 모든 사용자가 읽기 가능
CREATE POLICY "posts_select_all"
ON public.posts FOR SELECT
TO public
USING (true);

-- 작성/수정/삭제는 애플리케이션 레벨에서 Clerk 인증 및 user_id로 권한 확인
-- 주의: Supabase는 Clerk와 직접 통합되지 않으므로, 
-- RLS에서는 모든 사용자에게 접근을 허용하고 실제 권한 확인은 애플리케이션에서 처리합니다.
CREATE POLICY "posts_insert_all"
ON public.posts FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "posts_update_all"
ON public.posts FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "posts_delete_all"
ON public.posts FOR DELETE
TO public
USING (true);

-- Comments 테이블 정책
-- 모든 사용자가 읽기 가능
CREATE POLICY "comments_select_all"
ON public.comments FOR SELECT
TO public
USING (true);

-- 작성/수정/삭제는 애플리케이션 레벨에서 Clerk 인증 및 user_id로 권한 확인
CREATE POLICY "comments_insert_all"
ON public.comments FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "comments_update_all"
ON public.comments FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "comments_delete_all"
ON public.comments FOR DELETE
TO public
USING (true);

-- Recommendations 테이블 정책
-- 모든 사용자가 읽기 가능
CREATE POLICY "recommendations_select_all"
ON public.recommendations FOR SELECT
TO public
USING (true);

-- 작성은 애플리케이션 레벨에서 Clerk 인증 및 user_id로 권한 확인
CREATE POLICY "recommendations_insert_all"
ON public.recommendations FOR INSERT
TO public
WITH CHECK (true);

-- Recommendations는 수정/삭제 불가 (추천 취소는 앱 로직에서 처리)
CREATE POLICY "recommendations_update_deny"
ON public.recommendations FOR UPDATE
TO public
USING (false);

CREATE POLICY "recommendations_delete_deny"
ON public.recommendations FOR DELETE
TO public
USING (false);

-- Comment_likes 테이블 정책
-- 모든 사용자가 읽기 가능
CREATE POLICY "comment_likes_select_all"
ON public.comment_likes FOR SELECT
TO public
USING (true);

-- 작성/삭제는 애플리케이션 레벨에서 Clerk 인증 및 user_id로 권한 확인
CREATE POLICY "comment_likes_insert_all"
ON public.comment_likes FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "comment_likes_delete_all"
ON public.comment_likes FOR DELETE
TO public
USING (true);

-- Comment_likes는 수정 불가
CREATE POLICY "comment_likes_update_deny"
ON public.comment_likes FOR UPDATE
TO public
USING (false);

-- Reports 테이블 정책
-- Reports는 읽기/작성은 애플리케이션 레벨에서 Clerk 인증으로 권한 확인
CREATE POLICY "reports_select_all"
ON public.reports FOR SELECT
TO public
USING (true);

CREATE POLICY "reports_insert_all"
ON public.reports FOR INSERT
TO public
WITH CHECK (true);

-- Reports는 수정/삭제 불가
CREATE POLICY "reports_update_deny"
ON public.reports FOR UPDATE
TO public
USING (false);

CREATE POLICY "reports_delete_deny"
ON public.reports FOR DELETE
TO public
USING (false);

