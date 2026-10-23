"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const hiddenDuringFlow = ["/profile", "/quiz", "/analyzing", "/result", "/premium"].some(
    (path) => pathname.startsWith(path)
  );

  if (hiddenDuringFlow) return null;

  return (
    <footer className="relative z-10 max-w-md mx-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-6">
      <div className="border-t border-[#E8D5E8]/30 pt-6">
        {/* 링크 */}
        <div className="flex items-center justify-center gap-3 mb-4 text-[11px]">
          <Link
            href="/terms"
            className="ait-touch-target flex items-center text-[#B8A0BC] hover:text-[#E879A4] transition-colors"
          >
            이용약관
          </Link>
          <span className="w-0.5 h-0.5 rounded-full bg-[#D4C0D8]" />
          <Link
            href="/privacy"
            className="ait-touch-target flex items-center text-[#B8A0BC] hover:text-[#E879A4] transition-colors"
          >
            개인정보처리방침
          </Link>
          <span className="w-0.5 h-0.5 rounded-full bg-[#D4C0D8]" />
          <Link href="/account" className="ait-touch-target flex items-center text-[#B8A0BC] hover:text-[#E879A4] transition-colors">
            계정 관리
          </Link>
        </div>

        {/* 저작권 */}
        <p className="text-center text-[10px] text-[#D4C0D8] mt-3">
          © 2026 너는내운멍
        </p>
      </div>
    </footer>
  );
}
