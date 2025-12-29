// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#1a1a1b] border-t border-[#343536] mt-8">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 icon-accent rounded-full">
              <svg
                viewBox="0 0 20 20"
                className="w-4 h-4 text-white"
                fill="currentColor"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm5.2 11.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5zm-8.9 3.1a6.5 6.5 0 0 0 7.4 0 .5.5 0 0 0-.6-.8 5.5 5.5 0 0 1-6.2 0 .5.5 0 1 0-.6.8zm-.5-4.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
              </svg>
            </div>
            <span className="text-sm text-[#818384]">
              &copy; {new Date().getFullYear()} Blue Circle Community
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs text-[#818384] flex-wrap justify-center md:justify-start">
            <a href="#" className="hover:text-[#d7dadc] transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-[#d7dadc] transition-colors">
              개인정보처리방침
            </a>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScgKTgxpQCvFUXfCBXTu-gfmrorGUsIxbp0oIfmj7MePhT1BA/viewform?usp=dialog" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#d7dadc] transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
