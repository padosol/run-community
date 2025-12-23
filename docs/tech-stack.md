# 기술 스택

## 핵심 프레임워크

- **Next.js**: `16.1.0` (서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG) 및 API 라우트를 지원하는 React 기반의 풀스택 웹 애플리케이션 프레임워크입니다.)
- **React**: `19.2.3` (사용자 인터페이스(UI)를 구축하기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 개발을 통해 재사용 가능한 UI를 만들 수 있습니다.)
- **TypeScript**: `5.9.3` (JavaScript에 정적 타입을 추가하여 코드의 안정성과 유지보수성을 높이는 언어입니다. 개발 단계에서 오류를 줄이는 데 도움을 줍니다.)

## 데이터베이스 & 인프라

- **@supabase/supabase-js**: `2.89.0` (Supabase 클라이언트 라이브러리로, PostgreSQL 데이터베이스, 인증, 스토리지 등 Supabase의 다양한 기능을 웹 애플리케이션에서 쉽게 사용할 수 있도록 돕습니다.)
- **@supabase/ssr**: `0.8.0` (Next.js의 서버 사이드 렌더링 환경에서 Supabase를 연동하는 데 필요한 유틸리티를 제공합니다.)

## 스타일링

- **tailwindcss**: `4.1.18` (유틸리티 우선(utility-first) 방식의 CSS 프레임워크입니다. HTML 마크업 내에서 직접 클래스 이름을 조합하여 스타일을 빠르게 적용할 수 있습니다.)
- **autoprefixer**: `10.4.23` (CSS에 자동으로 벤더 프리픽스(vendor prefixes)를 추가하여 다양한 브라우저 호환성을 확보합니다.)
- **postcss**: `8.5.6` (CSS를 JavaScript 플러그인을 사용하여 변환하는 도구로, Tailwind CSS와 같은 프레임워크의 기반 기술로 사용됩니다.)

## UI 컴포넌트

- **@radix-ui/react-\***: `최신` (스타일이 없는(unstyled), 접근성을 고려한(accessible) React UI 컴포넌트 프리미티브(예: Dialog, Dropdown Menu)를 제공하여 커스텀 디자인을 쉽게 구축할 수 있도록 합니다.)
- **class-variance-authority**: `0.7.1` (컴포넌트의 props에 따라 Tailwind CSS 클래스를 조건부로 조합하는 데 사용되는 유틸리티입니다.)
- **clsx**: `2.1.1` (조건부로 `className` 문자열을 구성할 때 유용하며, 여러 클래스를 간결하게 병합할 수 있습니다.)
- **tailwind-merge**: `3.4.0` (Tailwind CSS 클래스 간의 스타일 충돌 없이 안전하게 병합하는 유틸리티입니다.)
- **lucide-react**: `0.562.0` (React 애플리케이션에서 사용할 수 있는 다양한 오픈소스 SVG 아이콘 컬렉션입니다.)

## 유틸리티

- **date-fns**: `4.1.0` (날짜 및 시간 조작을 위한 가볍고 모듈화된 JavaScript 유틸리티 라이브러리입니다.)
- **zod**: `4.2.1` (TypeScript 우선 스키마 선언 및 유효성 검사 라이브러리로, 데이터 구조를 정의하고 런타임에 유효성을 검사하는 데 사용됩니다 (예: 폼 입력값, API 페이로드).)`
- **react-hook-form**: `7.69.0` (React에서 폼을 효율적이고 유연하게 관리하며, 성능을 최적화하고 쉬운 유효성 검사를 제공합니다.)
- **@hookform/resolvers**: `5.2.2` ( `react-hook-form`과 Zod와 같은 외부 유효성 검사 라이브러리를 통합하는 데 사용됩니다.)

## 이미지 처리 (선택)

- **sharp**: `0.34.5` (Node.js 환경에서 이미지를 고성능으로 처리(리사이징, 포맷 변환 등)하는 라이브러리입니다.)
- **react-dropzone**: `14.3.8` (HTML5 드래그 앤 드롭 기능을 사용하여 파일을 업로드할 수 있는 React 컴포넌트입니다.)

## 개발 도구

- **eslint**: `9.39.2` (JavaScript 코드에서 잠재적인 오류, 버그, 스타일 문제를 식별하고 보고하는 정적 분석 도구입니다.)
- **eslint-config-next**: `16.1.0` (Next.js 프로젝트를 위한 ESLint 설정으로, Next.js 프로젝트에 적합한 규칙을 제공합니다.)
- **@types/node**: `20.14.15` (Node.js 라이브러리에 대한 TypeScript 타입 정의 파일입니다.)
- **@types/react**: `19.2.7` (React 라이브러리에 대한 TypeScript 타입 정의 파일입니다.)
- **@types/react-dom**: `19.2.3` (ReactDOM 라이브러리에 대한 TypeScript 타입 정의 파일입니다.)
