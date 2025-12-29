# Community 프로젝트 Claude Code Rules

## 유지보수 작업 시 (조건부)

> **트리거 키워드**: 사용자가 "유지보수", "maintenance", "MT-" 등의 키워드를 사용하면 아래 문서들을 반드시 읽고 참고하세요.

유지보수 요청 시 참고할 문서:
1. `docs/MAINTENANCE.md` - 유지보수 사이클 및 가이드
2. `todo/MAINTENANCE_LOG_2025-12-29.md` - 유지보수 내역 로그 (여기에 작업 내역 추가)

### 유지보수 사이클 (중요!)

```
1. 내역서 작성 → 2. 유지보수 → 3. 검증 요청 → 4. Git Push
```

**3단계 검증 요청**: 코드 수정 후 반드시 사용자에게 검증을 요청하세요!
- "검증을 진행해주세요. 확인되면 Git Push 하겠습니다." 라고 물어볼 것
- 사용자가 확인 후 Git Push 진행

### 유지보수 내역 ID 형식

- 형식: `MT-YYYYMMDD-NNN`
- 예시: `MT-20251229-011`
- 날짜별로 001부터 순차 증가

---

## 프로젝트 구조

```
community/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── _actions/           # Server Actions
│   │   ├── api/                # API Routes
│   │   ├── posts/[id]/         # 게시글 상세
│   │   └── ...
│   ├── components/             # React 컴포넌트
│   │   ├── comments/           # 댓글 관련
│   │   ├── common/             # 공통 컴포넌트
│   │   ├── layout/             # 레이아웃
│   │   └── posts/              # 게시글 관련
│   └── lib/                    # 유틸리티
│       ├── clerk/              # Clerk 인증
│       ├── constants/          # 상수 정의
│       ├── supabase/           # Supabase 클라이언트
│       └── validation/         # Zod 스키마
├── supabase/migrations/        # DB 마이그레이션
├── docs/                       # 문서
└── todo/                       # 유지보수 로그
```

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16.1.1 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Styling | TailwindCSS |
| Validation | Zod |
| Form | React Hook Form |

---

## 참고 문서

- 기술 스택 상세: `docs/tech-stack.md`
- DB 스키마: `docs/SCHEMA.md`
- 유지보수 가이드: `docs/MAINTENANCE.md`

---

## 코딩 컨벤션

### Server Actions
- 파일 위치: `src/app/_actions/`
- `"use server"` 지시문 필수
- 에러 시 `throw new Error()` 사용

### 컴포넌트
- 서버 컴포넌트 기본, 클라이언트 필요 시 `"use client"` 추가
- 클라이언트 컴포넌트는 `*Client.tsx` 네이밍 권장

### 데이터베이스
- Supabase 클라이언트: `createClient()` from `@/lib/supabase/server`
- 마이그레이션 파일: `supabase/migrations/NNNN_description.sql`

### 인증
- Clerk 사용자 ID: `auth()` from `@clerk/nextjs/server`
- 사용자 존재 확인: `ensureUserExists(userId)` from `@/lib/clerk/server`

---

## 주요 기능 구현 참고

### 카테고리 시스템
- 상수 파일: `src/lib/constants/category.ts`
- 카테고리: 자유게시판(free), 질문(question), 정보공유(info), 유머(humor)

### SEO
- 기본 메타데이터: `src/app/layout.tsx`
- 동적 메타데이터: `generateMetadata()` 함수
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`

### 인증 플로우
- Clerk Webhook: `src/app/api/webhooks/clerk/route.ts`
- 사용자 동기화: Clerk → Supabase users 테이블
