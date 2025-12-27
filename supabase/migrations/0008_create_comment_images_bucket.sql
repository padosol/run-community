-- 'comment_images' 버킷 생성 (버킷이 없으면)
INSERT INTO storage.buckets (id, name, public)
VALUES ('comment_images', 'comment_images', true)
ON CONFLICT (id) DO NOTHING;

-- 'comment_images' 버킷 RLS 정책: 인증된 사용자만 업로드 허용
DROP POLICY IF EXISTS "Allow authenticated comment image uploads" ON storage.objects;
CREATE POLICY "Allow authenticated comment image uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'comment_images');

-- 'comment_images' 버킷 RLS 정책: 누구나 읽기 허용
DROP POLICY IF EXISTS "Allow public comment image read" ON storage.objects;
CREATE POLICY "Allow public comment image read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'comment_images');

-- 'comment_images' 버킷 RLS 정책: 인증된 사용자만 삭제 허용
DROP POLICY IF EXISTS "Allow authenticated comment image delete" ON storage.objects;
CREATE POLICY "Allow authenticated comment image delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'comment_images');

