-- 'post_images' 버킷 생성 (버킷이 없으면)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post_images', 'post_images', true)
ON CONFLICT (id) DO NOTHING;

-- 'post_images' 버킷 RLS 정책: 누구나 업로드 허용
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'post_images');

-- 'post_images' 버킷 RLS 정책: 누구나 읽기 허용
DROP POLICY IF EXISTS "Allow anonymous read access" ON storage.objects;
CREATE POLICY "Allow anonymous read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post_images');

-- 'post_images' 버킷 RLS 정책: 서버 액션을 통한 삭제 허용
DROP POLICY IF EXISTS "Allow server delete" ON storage.objects;
CREATE POLICY "Allow server delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post_images');
