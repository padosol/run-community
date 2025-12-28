// src/components/layout/Header.tsx
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#1a1a1b] border-b border-[#343536] sticky top-0 z-50">
      <div className="container mx-auto px-4 h-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 icon-accent rounded-full">
            <svg
              viewBox="0 0 20 20"
              className="w-5 h-5 text-white"
              fill="currentColor"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm5.2 11.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5zm-8.9 3.1a6.5 6.5 0 0 0 7.4 0 .5.5 0 0 0-.6-.8 5.5 5.5 0 0 1-6.2 0 .5.5 0 1 0-.6.8zm-.5-4.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#d7dadc] group-hover:text-white transition-colors hidden sm:block">
            블루써클 커뮤니티
          </span>
        </Link>

        {/* Search Bar (간단 버전) */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#272729] border border-[#343536] rounded-full px-4 py-1.5 text-sm text-[#d7dadc] placeholder-[#818384] focus:outline-none focus:border-[#d7dadc] focus:bg-[#030303]"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818384]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right Actions */}
        <nav className="flex items-center gap-2">
          <SignedIn>
            <Link
              href="/saved"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#d7dadc] hover:bg-[#272729] rounded-full transition-colors"
              title="저장된 게시글"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </Link>
            <Link
              href="/new-post"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#d7dadc] hover:bg-[#272729] rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">글쓰기</span>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-accent px-5 py-1.5 text-sm rounded-full transition-colors">
                로그인
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-accent-outline px-5 py-1.5 text-sm rounded-full transition-colors hidden sm:block">
                회원가입
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
