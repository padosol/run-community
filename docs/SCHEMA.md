# Supabase 데이터베이스 스키마 정의

## 1. `users` 테이블 (New)

- **목적:** Clerk 사용자 정보 저장 및 닉네임 관리
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `clerk_user_id`: `text` (Unique, Clerk 사용자 ID)
  - `nickname`: `text` (사용자 닉네임)
  - `avatar_url`: `text` (옵션, 프로필 이미지 URL)
  - `email`: `text` (옵션, 이메일)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `updated_at`: `timestamp with time zone` (default `now()`)

## 2. `posts` 테이블

- **목적:** 게시글 저장
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `user_id`: `text` (Foreign Key to `users.clerk_user_id`, 작성자)
  - `title`: `text` (게시글 제목)
  - `content`: `text` (게시글 내용)
  - `image_url`: `text` (옵션, 첨부된 단일 이미지의 URL)
  - `views`: `integer` (default 0, 조회수)
  - `likes`: `integer` (default 0, 추천수 - 레거시)
  - `upvotes`: `integer` (default 0, 추천수)
  - `downvotes`: `integer` (default 0, 비추천수)
  - `author_nickname`: `text` (nullable, 레거시 - 비회원 닉네임)
  - `password_hash`: `text` (nullable, 레거시 - 게시글 수정/삭제용 비밀번호)

## 3. `comments` 테이블

- **목적:** 게시글에 대한 댓글 저장
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `post_id`: `UUID` (Foreign Key to `posts.id`, 게시글과 연결)
  - `user_id`: `text` (Foreign Key to `users.clerk_user_id`, 작성자)
  - `content`: `text` (댓글 내용)
  - `parent_comment_id`: `UUID` (옵션, 대댓글용 부모 댓글 ID)
  - `image_url`: `text` (옵션, 첨부 이미지 URL)
  - `link_url`: `text` (옵션, 첨부 링크 URL)
  - `link_preview`: `jsonb` (옵션, 링크 미리보기 데이터)
  - `likes`: `integer` (default 0, 좋아요 수)
  - `author_nickname`: `text` (nullable, 레거시 - 비회원 닉네임)
  - `password_hash`: `text` (nullable, 레거시 - 댓글 수정/삭제용 비밀번호)

## 4. `recommendations` 테이블

- **목적:** 게시글 추천/비추천 기록 및 중복 방지
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `post_id`: `UUID` (Foreign Key to `posts.id`, 어떤 게시글을 추천했는지)
  - `user_id`: `text` (추천한 사용자 ID - Clerk user_id)
  - `vote_type`: `integer` (default 1, 1=추천, -1=비추천)
  - `user_identifier`: `text` (nullable, 레거시 - IP/세션 기반 식별)

## 5. `bookmarks` 테이블

- **목적:** 사용자별 게시글 저장(북마크) 기능
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `user_id`: `text` (사용자 ID - Clerk user_id)
  - `post_id`: `UUID` (Foreign Key to `posts.id`, 저장한 게시글)
- **제약조건:**
  - `UNIQUE(user_id, post_id)` - 중복 저장 방지

## 6. `comment_likes` 테이블

- **목적:** 댓글 좋아요 기록
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `comment_id`: `UUID` (Foreign Key to `comments.id`)
  - `user_id`: `text` (좋아요한 사용자 ID)

## 7. `reports` 테이블

- **목적:** 유해 게시글/댓글 신고 기록
- **컬럼:**
  - `id`: `UUID` (Primary Key, default `gen_random_uuid()`)
  - `created_at`: `timestamp with time zone` (default `now()`)
  - `target_id`: `UUID` (신고 대상의 ID, `posts.id` 또는 `comments.id`)
  - `target_type`: `text` (신고 대상의 타입, `'post'` 또는 `'comment'`)
  - `reason`: `text` (신고 사유)

## ERD 관계도

```
users (clerk_user_id) <──┬── posts (user_id)
                         ├── comments (user_id)
                         ├── recommendations (user_id)
                         └── bookmarks (user_id)

posts (id) <──┬── comments (post_id)
              ├── recommendations (post_id)
              └── bookmarks (post_id)

comments (id) <── comment_likes (comment_id)
comments (id) <── comments (parent_comment_id) [자기참조 - 대댓글]
```
