# 유지보수 내역 로그

이 문서는 모든 유지보수 작업의 이력을 기록합니다.

---

## 2024년 유지보수 내역

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-001

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 낮음
- **예상 소요 시간**: 5분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 게시글 목록 페이지에 글쓰기 버튼이 중복되어 있음 (헤더에 이미 존재)
- **영향 범위**: 메인 페이지 (게시글 목록)
- **해결 방안**: 게시글 목록 페이지의 글쓰기 버튼 제거

#### 변경 파일 목록

- [x] src/app/page.tsx

#### 테스트 계획

- [x] 메인 페이지 정상 렌더링 확인
- [x] 헤더의 글쓰기 버튼 동작 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검토 완료
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-002

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 30분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 기본 UI가 단순하여 레딧(Reddit) 스타일의 모던한 디자인으로 개선 필요
- **영향 범위**: 전체 UI (헤더, 푸터, 게시글 목록, 게시글 상세)
- **해결 방안**: 다크 테마 기반 레딧 스타일 UI 적용

#### 변경 파일 목록

- [x] src/app/globals.css - 레딧 스타일 다크 테마, CSS 변수, 컴포넌트 스타일
- [x] src/components/layout/Header.tsx - 레딧 스타일 헤더 (다크, 주황색 악센트)
- [x] src/components/layout/Footer.tsx - 레딧 스타일 푸터
- [x] src/components/posts/PostList.tsx - 레딧 스타일 게시글 카드 (왼쪽 투표 버튼)
- [x] src/app/page.tsx - 메인 페이지 레이아웃 (정렬 탭, 글쓰기 프롬프트)
- [x] src/app/posts/[id]/page.tsx - 상세 페이지 레딧 스타일

#### 테스트 계획

- [x] 메인 페이지 렌더링 확인
- [x] 게시글 상세 페이지 렌더링 확인
- [x] 헤더/푸터 레이아웃 확인
- [x] 반응형 디자인 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검토 완료
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-003

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 15분
- **담당자**: -

#### 작업 상세

- **문제 설명**: new-post 페이지의 톤이 레딧 스타일과 맞지 않고, 버튼 사이즈가 너무 큼
- **영향 범위**: 새 글 작성 페이지, 글 수정 페이지
- **해결 방안**: 다크 테마 적용 및 버튼 사이즈 조정

#### 변경 파일 목록

- [x] src/app/new-post/NewPostClient.tsx - 다크 테마, 레딧 스타일 레이아웃
- [x] src/components/posts/PostForm.tsx - 다크 입력폼, 라운드 버튼, 버튼 사이즈 축소

#### 테스트 계획

- [x] 새 글 작성 페이지 렌더링 확인
- [x] 폼 입력 및 제출 동작 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검토 완료
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-004

#### 작업 개요

- **작업 유형**: 리팩토링
- **우선순위**: 보통
- **예상 소요 시간**: 20분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 악센트 컬러(#ff4500)가 각 파일에 하드코딩되어 있어 변경 시 여러 파일 수정 필요
- **영향 범위**: 전체 UI 컴포넌트
- **해결 방안**: CSS 변수와 유틸리티 클래스로 중앙 관리

#### 변경 파일 목록

- [x] src/app/globals.css - 악센트 유틸리티 클래스 추가 (bg-accent, text-accent, btn-accent 등)
- [x] src/components/layout/Header.tsx - icon-accent, btn-accent 클래스 적용
- [x] src/components/layout/Footer.tsx - icon-accent 클래스 적용
- [x] src/components/posts/PostList.tsx - hover:text-accent 클래스 적용
- [x] src/components/posts/PostForm.tsx - text-accent, btn-accent 클래스 적용
- [x] src/app/new-post/NewPostClient.tsx - border-b-accent, border-l-accent, text-accent 클래스 적용
- [x] src/app/page.tsx - text-accent 클래스 적용
- [x] src/app/posts/[id]/page.tsx - tag-accent 클래스 적용

#### 테스트 계획

- [x] 모든 페이지 렌더링 확인
- [x] 악센트 컬러 일관성 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검토 완료
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-005

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 낮음
- **예상 소요 시간**: 5분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 주황색(#ff4500) 악센트가 레딧과 너무 유사하여 차별화 필요
- **영향 범위**: 전체 UI 악센트 컬러
- **해결 방안**: 블루(#0079d3) 악센트 컬러로 변경

#### 변경 파일 목록

- [x] src/app/globals.css - --accent, --accent-hover, --upvote 컬러 변경

#### 테스트 계획

- [x] 전체 UI 블루 톤 적용 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검토 완료
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-006

#### 작업 개요

- **작업 유형**: 버그수정
- **우선순위**: 긴급
- **예상 소요 시간**: 10분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 게시글 작성이 되지 않음 - redirect() 에러가 catch에 잡혀서 에러로 처리됨
- **영향 범위**: 게시글 작성 기능
- **해결 방안**: isRedirectError 체크 추가하여 redirect 에러는 다시 throw

#### 변경 파일 목록

- [x] src/app/new-post/NewPostClient.tsx - isRedirectError 체크 추가

#### 테스트 계획

- [x] 게시글 작성 후 홈으로 리다이렉트 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검토 완료
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-007

#### 작업 개요

- **작업 유형**: 기능개선
- **우선순위**: 보통
- **예상 소요 시간**: 20분
- **담당자**: -

#### 작업 상세

- **문제 설명**:
  1. 게시글 상세 페이지의 댓글 영역이 다크 테마와 맞지 않음
  2. 댓글 작성 폼에 불필요한 필드(이미지, 링크 URL)가 있음
  3. 댓글 작성 UI가 복잡함
- **영향 범위**: 댓글 폼, 댓글 목록, 댓글 아이템
- **해결 방안**: 다크 테마 적용 및 댓글 폼 간소화

#### 변경 파일 목록

- [x] src/components/comments/CommentForm.tsx
- [x] src/components/comments/CommentList.tsx
- [x] src/components/comments/CommentItem.tsx
- [x] src/components/posts/LikeButton.tsx
- [x] src/components/posts/PostActions.tsx
- [x] src/app/posts/[id]/page.tsx

#### 테스트 계획

- [x] 댓글 작성 기능 동작 확인
- [x] 다크 테마 일관성 확인

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 요청
- [x] Git Push (완료)

---

### [2024-12-27] 유지보수 내역

#### 작업 ID: MT-20241227-008

#### 작업 개요

- **작업 유형**: 버그수정
- **우선순위**: 높음
- **예상 소요 시간**: 10분
- **담당자**: -

#### 작업 상세

- **문제 설명**: 댓글 등록 기능이 정상 동작하지 않음
- **원인 분석**:
  1. 댓글 유효성 검사에서 최소 글자 수가 5자로 설정됨
  2. Zod 스키마에서 null 값 허용하지 않음
  3. DB comments 테이블의 author_nickname 컬럼이 NOT NULL
- **해결 방안**:
  1. 최소 글자 수를 1자로 변경
  2. 스키마에 .nullable() 추가
  3. DB 마이그레이션 적용 (author_nickname DROP NOT NULL)

#### 변경 파일 목록

- [x] src/lib/validation/comment.ts
- [x] src/app/\_actions/comment.ts (에러 로깅 강화)

#### 테스트 계획

- [x] 짧은 댓글 작성 테스트
- [x] 긴 댓글 작성 테스트

#### 상태

- [x] 내역서 작성
- [x] 유지보수 진행
- [x] 검증 요청
- [x] Git Push (완료)

---

### [2024-12-29] 유지보수 내역

#### 작업 ID: MT-20241229-001

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

#### 최종 완료 (2024-12-29)

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

## 템플릿

아래 템플릿을 복사하여 새로운 유지보수 내역을 추가하세요.

```markdown
### [YYYY-MM-DD] 유지보수 내역

#### 작업 ID: MT-YYYYMMDD-XXX

#### 작업 개요

- **작업 유형**: [버그수정 / 기능개선 / 성능최적화 / 보안패치 / 리팩토링]
- **우선순위**: [긴급 / 높음 / 보통 / 낮음]
- **예상 소요 시간**:
- **담당자**:

#### 작업 상세

- **문제 설명**:
- **영향 범위**:
- **해결 방안**:

#### 변경 파일 목록

- [ ] 파일1
- [ ] 파일2

#### 테스트 계획

- [ ] 테스트 항목1
- [ ] 테스트 항목2

#### 상태

- [ ] 내역서 작성
- [ ] 유지보수 진행
- [ ] 검토 완료
- [ ] Git Push
```
