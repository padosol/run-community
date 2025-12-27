-- Posts 테이블 RLS 정책
CREATE POLICY "posts_select_policy" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_policy" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "posts_update_deny" ON public.posts FOR UPDATE USING (false); -- 앱 로직에서 비밀번호 확인 후 처리
CREATE POLICY "posts_delete_deny" ON public.posts FOR DELETE USING (false); -- 앱 로직에서 비밀번호 확인 후 처리

-- Comments 테이블 RLS 정책
CREATE POLICY "comments_select_policy" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_policy" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_update_deny" ON public.comments FOR UPDATE USING (false); -- 앱 로직에서 비밀번호 확인 후 처리
CREATE POLICY "comments_delete_deny" ON public.comments FOR DELETE USING (false); -- 앱 로직에서 비밀번호 확인 후 처리

-- Recommendations 테이블 RLS 정책
CREATE POLICY "recommendations_select_policy" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "recommendations_insert_policy" ON public.recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "recommendations_update_deny" ON public.recommendations FOR UPDATE USING (false);
CREATE POLICY "recommendations_delete_deny" ON public.recommendations FOR DELETE USING (false);

-- Reports 테이블 RLS 정책
CREATE POLICY "reports_select_deny" ON public.reports FOR SELECT USING (false); -- 관리자만 열람
CREATE POLICY "reports_insert_policy" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "reports_update_deny" ON public.reports FOR UPDATE USING (false);
CREATE POLICY "reports_delete_deny" ON public.reports FOR DELETE USING (false);
