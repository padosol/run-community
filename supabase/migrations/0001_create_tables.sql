-- 1. Posts 테이블 생성
CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  author_nickname text NOT NULL,
  password_hash text NOT NULL, -- 앱에서 bcrypt 해시값으로 저장
  content text NOT NULL,
  image_url text,
  views integer DEFAULT 0 NOT NULL,
  likes integer DEFAULT 0 NOT NULL
);

-- 2. Comments 테이블 생성
CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_nickname text NOT NULL,
  password_hash text NOT NULL, -- 앱에서 bcrypt 해시값으로 저장
  content text NOT NULL
);

-- 3. Recommendations 테이블 생성
CREATE TABLE public.recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_identifier text NOT NULL, -- IP 주소 또는 해싱된 쿠키/세션 ID 저장
  UNIQUE (post_id, user_identifier) -- 게시글당 동일 식별자 중복 추천 방지
);

-- 4. Reports 테이블 생성
CREATE TABLE public.reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  target_id uuid NOT NULL, -- 신고 대상의 ID (post_id 또는 comment_id)
  target_type text NOT NULL, -- 'post' 또는 'comment'
  reason text NOT NULL
);
