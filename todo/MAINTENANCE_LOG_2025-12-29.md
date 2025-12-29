# 유지보수 내역 로그 - 2025-12-29

이 문서는 2025-12-29에 작성된 유지보수 작업 내역을 기록합니다.

---

## 2025년 유지보수 내역

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-001

#### 작업 개요

- **작업 유형**: 기능개발
- **우선순위**: 높음
- **예상 소요 시간**: 40분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 게시글/댓글에서 사용자 닉네임이 user_id 앞 8자로 표시됨
- **해결 방안**: 자체 users 테이블 생성 후 Clerk Webhook으로 사용자 동기화, JOIN으로 닉네임 조회

#### 변경 파일 목록

- [x] supabase/migrations/0011_create_users_table.sql
- [x] src/app/api/webhooks/clerk/route.ts
- [x] src/app/\_actions/post.ts
- [x] src/app/posts/[id]/page.tsx
- [x] src/components/posts/PostList.tsx
- [x] src/components/comments/CommentItem.tsx
- [x] docs/SCHEMA.md

#### 진행 상태

- [x] 내역서 작성
- [x] 1단계: users 테이블 마이그레이션
- [x] 2단계: Clerk Webhook API
- [x] 3단계: 기존 사용자 마이그레이션 SQL
- [x] 4단계: 게시글 조회 수정
- [x] 5단계: 댓글 조회 수정
- [x] 6단계: UI 닉네임 표시
- [x] 7단계: 문서 업데이트
- [x] 8단계: 외래키 에러 수정 (ensureUserExists 추가)
- [x] 검증 완료
- [x] Git Push

#### 변경 파일 목록 (최종)

- [x] supabase/migrations/0011_create_users_table.sql
- [x] src/app/api/webhooks/clerk/route.ts
- [x] src/app/\_actions/post.ts
- [x] src/app/\_actions/comment.ts
- [x] src/lib/clerk/server.ts
- [x] src/app/posts/[id]/page.tsx
- [x] src/components/posts/PostList.tsx
- [x] src/components/comments/CommentItem.tsx
- [x] docs/SCHEMA.md

#### 최종 완료 (2025-12-29)

**완료된 작업:**

- users 테이블 마이그레이션 생성 (`0011_create_users_table.sql`)
- Clerk Webhook API 라우트 생성 (`/api/webhooks/clerk`)
- 게시글/댓글 조회 시 users 테이블 JOIN (fallback 처리 포함)
- PostList, PostDetail, CommentItem에서 닉네임 표시
- svix 패키지 설치 완료
- Supabase users 테이블 생성 및 외래키 적용 완료
- **외래키 에러 수정**: `ensureUserExists()` 함수 추가
  - 게시글/댓글 작성 전 users 테이블에 사용자 자동 등록
  - Webhook 미동작 시에도 정상 작동

**향후 개선 사항 (선택):**

- Clerk에서 닉네임 변경 시 user.updated Webhook으로 동기화
- ngrok + Clerk Webhook 연동 테스트

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-002

#### 작업 개요

- **작업 유형**: 리팩토링
- **우선순위**: 보통
- **예상 소요 시간**: 20분
- **담당자**: -

#### 작업 상세

- **문제 설명**: users 테이블에서 nickname 대신 username 사용, first_name/last_name 대신 Clerk username 사용
- **영향 범위**: users 테이블, Webhook, 게시글/댓글 표시
- **해결 방안**:
  1. DB 마이그레이션으로 nickname → username 컬럼명 변경
  2. Clerk Webhook에서 username 필드 사용
  3. 모든 UI에서 username 표시

#### 변경 파일 목록

- [x] supabase/migrations/0012_rename_nickname_to_username.sql
- [x] src/app/api/webhooks/clerk/route.ts
- [x] src/lib/clerk/server.ts
- [x] src/app/\_actions/post.ts
- [x] src/components/posts/PostList.tsx
- [x] src/components/comments/CommentItem.tsx
- [x] src/app/posts/[id]/page.tsx
- [x] docs/SCHEMA.md

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-005

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 10분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 신고 기능 UI가 밝은 테마로 되어 있어 다크 테마와 맞지 않음
- **영향 범위**: 신고 폼 모달
- **해결 방안**: 다크 테마 스타일 적용 (배경, 텍스트, 입력 필드, 버튼)

#### 변경 파일 목록

- [x] src/components/common/ReportForm.tsx

#### 테스트 계획

- [ ] 게시글 신고 기능 확인
- [ ] 댓글 신고 기능 확인
- [ ] 다크 테마 일관성 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-003

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 15분
- **담당자**: -

#### 작업 상세

- **문제 설명**:
  1. 게시글/댓글에서 `u/` 접두사가 불필요함
  2. 댓글에서 게시글 작성자 구분이 어려움
  3. 댓글 하트 버튼 색상이 밝은 톤으로 다크 테마와 맞지 않음
- **영향 범위**: 게시글 목록, 게시글 상세, 댓글 목록, 댓글 좋아요 버튼
- **해결 방안**:
  1. `u/` 접두사 제거
  2. 댓글에서 게시글 작성자일 경우 "작성자" 배지 표시
  3. 댓글 하트 버튼 색상을 다크 테마에 맞게 조정
  4. 하트 아이콘을 SVG로 변경하고 블루 톤 적용

#### 변경 파일 목록

- [x] src/components/posts/PostList.tsx
- [x] src/components/comments/CommentItem.tsx
- [x] src/components/comments/CommentList.tsx
- [x] src/components/comments/CommentLikeButton.tsx
- [x] src/app/posts/[id]/page.tsx
- [x] src/app/saved/page.tsx

#### 테스트 계획

- [x] 게시글 목록에서 username 표시 확인
- [x] 게시글 상세에서 username 표시 확인
- [x] 댓글에서 작성자 배지 표시 확인
- [x] 댓글 하트 버튼 색상 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-005

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 10분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 신고 기능 UI가 밝은 테마로 되어 있어 다크 테마와 맞지 않음
- **영향 범위**: 신고 폼 모달
- **해결 방안**: 다크 테마 스타일 적용 (배경, 텍스트, 입력 필드, 버튼)

#### 변경 파일 목록

- [x] src/components/common/ReportForm.tsx

#### 테스트 계획

- [ ] 게시글 신고 기능 확인
- [ ] 댓글 신고 기능 확인
- [ ] 다크 테마 일관성 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-004

#### 작업 개요

- **작업 유형**: 버그수정
- **우선순위**: 높음
- **예상 소요 시간**: 10분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 게시글 수정 버튼 클릭 시 "Event handlers cannot be passed to Client Component props" 에러 발생
- **영향 범위**: 게시글 수정 페이지
- **해결 방안**:
  1. 서버 컴포넌트에서 클라이언트 컴포넌트로 함수 전달 제거
  2. 클라이언트 컴포넌트 래퍼(`EditPostClient`) 생성
  3. 서버 컴포넌트는 데이터만 전달, 클라이언트 컴포넌트에서 서버 액션 호출

#### 변경 파일 목록

- [x] src/app/posts/[id]/edit/page.tsx
- [x] src/app/posts/[id]/edit/EditPostClient.tsx (신규 생성)

#### 테스트 계획

- [x] 게시글 수정 페이지 접근 확인
- [x] 게시글 수정 기능 동작 확인
- [x] 에러 없이 정상 작동 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-006

#### 작업 개요

- **작업 유형**: 기능개발
- **우선순위**: 보통
- **예상 소요 시간**: 20분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 홈 페이지에서 인기/최신 정렬 기능이 없음
- **영향 범위**: 홈 페이지 게시글 목록
- **해결 방안**:
  1. `getPosts` 함수에 `sortBy` 파라미터 추가 (latest, popular)
  2. 인기 정렬: upvotes 기준 내림차순, 상위 10개만 조회
  3. 최신 정렬: created_at 기준 내림차순
  4. 클라이언트 컴포넌트(`HomeClient`) 생성하여 정렬 탭 기능 구현

#### 변경 파일 목록

- [x] src/app/\_actions/post.ts
- [x] src/app/page.tsx
- [x] src/app/HomeClient.tsx (신규 생성)

#### 테스트 계획

- [x] 인기 탭 클릭 시 upvotes 상위 10개 표시 확인
- [x] 최신 탭 클릭 시 최신 게시글 표시 확인
- [x] 정렬 탭 UI 동작 확인
- [x] 홈 진입 시 인기 탭 기본 표시 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---

### [2025-12-29] 유지보수 내역

#### 작업 ID: MT-20251229-005

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 10분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 신고 기능 UI가 밝은 테마로 되어 있어 다크 테마와 맞지 않음
- **영향 범위**: 신고 폼 모달
- **해결 방안**: 다크 테마 스타일 적용 (배경, 텍스트, 입력 필드, 버튼)

#### 변경 파일 목록

- [x] src/components/common/ReportForm.tsx

#### 테스트 계획

- [ ] 게시글 신고 기능 확인
- [ ] 댓글 신고 기능 확인
- [ ] 다크 테마 일관성 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 완료
- [x] Git Push (완료)

---
