# Supabase 데이터베이스 스키마 정의

## 1. `posts` 테이블

- **목적:** 익명 게시글 저장
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `author_nickname`: `text` (비회원 닉네임)
  - `password_hash`: `text` (게시글 수정/삭제용 비밀번호 해시, `bcrypt` 또는 유사 알고리즘 사용 예정)
  - `content`: `text` (게시글 내용)
  - `image_url`: `text` (옵션, 첨부된 단일 이미지의 URL)
  - `views`: `integer` (default 0, 조회수)
  - `likes`: `integer` (default 0, 추천수)

## 2. `comments` 테이블

- **목적:** 게시글에 대한 댓글 저장
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `post_id`: `UUID` (Foreign Key to `posts.id`, 게시글과 연결)
  - `author_nickname`: `text` (비회원 닉네임)
  - `password_hash`: `text` (댓글 수정/삭제용 비밀번호 해시)
  - `content`: `text` (댓글 내용)

## 3. `recommendations` 테이블

- **목적:** 게시글 추천 기록 및 중복 추천 방지
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `post_id`: `UUID` (Foreign Key to `posts.id`, 어떤 게시글을 추천했는지)
  - `user_identifier`: `text` (추천한 사용자를 식별하는 값, 예: IP 주소, 암호화된 세션/쿠키 ID)

## 4. `reports` 테이블

- **목적:** 유해 게시글/댓글 신고 기록
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `target_id`: `UUID` (신고 대상의 ID, `posts.id` 또는 `comments.id`)
  - `target_type`: `text` (신고 대상의 타입, `'post'` 또는 `'comment'`)
  - `reason`: `text` (신고 사유, 간략한 로그)
