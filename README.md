# Run Community

Next.js 기반의 커뮤니티 게시판 플랫폼입니다.

## 주요 기능

- 📝 **게시글 관리**: 카테고리별 게시글 작성, 수정, 삭제
- 💬 **댓글 시스템**: 게시글에 댓글 작성 및 좋아요
- 👍 **투표 기능**: 게시글 Upvote/Downvote 시스템
- 🔐 **사용자 인증**: Clerk 기반 소셜 로그인
- 🔍 **SEO 최적화**: 동적 메타데이터, Sitemap, Robots.txt
- ♾️ **무한 스크롤**: 게시글 목록 무한 스크롤
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 기술 스택

### Core
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19.2.3

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **Validation**: Zod 4.2

### Styling
- **CSS Framework**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React

### Forms & UX
- **Form Management**: React Hook Form
- **Notifications**: React Hot Toast
- **Infinite Scroll**: React Intersection Observer

## 시작하기

### 필요 조건

- Node.js 20 이상
- npm, yarn, pnpm, 또는 bun

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk Webhook (선택)
CLERK_WEBHOOK_SECRET=
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm run start
```

## 프로젝트 구조

```
community/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── _actions/           # Server Actions
│   │   ├── api/                # API Routes
│   │   ├── posts/[id]/         # 게시글 상세 페이지
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 페이지
│   │   ├── sitemap.ts          # 동적 Sitemap
│   │   └── robots.ts           # Robots.txt
│   ├── components/             # React 컴포넌트
│   │   ├── comments/           # 댓글 관련
│   │   ├── common/             # 공통 컴포넌트
│   │   ├── layout/             # 레이아웃
│   │   └── posts/              # 게시글 관련
│   └── lib/                    # 유틸리티 & 설정
│       ├── clerk/              # Clerk 인증 헬퍼
│       ├── constants/          # 상수 정의
│       ├── supabase/           # Supabase 클라이언트
│       └── validation/         # Zod 스키마
├── supabase/migrations/        # DB 마이그레이션
├── docs/                       # 프로젝트 문서
└── public/                     # 정적 파일
```

## 개발 가이드

### 코딩 컨벤션

#### Server Actions
- 파일 위치: `src/app/_actions/`
- 파일 상단에 `"use server"` 지시문 필수
- 에러 처리: `throw new Error()` 사용

#### 컴포넌트
- 기본적으로 서버 컴포넌트 사용
- 클라이언트 컴포넌트는 `"use client"` 지시문 추가
- 클라이언트 컴포넌트는 `*Client.tsx` 네이밍 권장

#### 데이터베이스
- Supabase 클라이언트: `createClient()` from `@/lib/supabase/server`
- 마이그레이션 파일: `supabase/migrations/NNNN_description.sql`

#### 인증
- Clerk 사용자 ID: `auth()` from `@clerk/nextjs/server`
- 사용자 존재 확인: `ensureUserExists(userId)`

### 카테고리 시스템

게시글은 4가지 카테고리로 구분됩니다:

- `free`: 자유게시판
- `question`: 질문
- `info`: 정보공유
- `humor`: 유머

카테고리 상수는 `src/lib/constants/category.ts`에서 관리합니다.

## 문서

- [기술 스택 상세](docs/tech-stack.md)
- [데이터베이스 스키마](docs/SCHEMA.md)
- [유지보수 가이드](docs/MAINTENANCE.md)
- [Claude Code 가이드](CLAUDE.md)

## 라이선스

Private Project
