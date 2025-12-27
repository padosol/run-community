// src/components/layout/Header.tsx
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          달리는 커뮤니티
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/new-post" className="p-2 bg-blue-700 rounded-md hover:bg-blue-800 transition-colors">
            글쓰기
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="p-2 bg-blue-700 rounded-md hover:bg-blue-800 transition-colors">
                로그인
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="p-2 bg-blue-700 rounded-md hover:bg-blue-800 transition-colors">
                회원가입
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
