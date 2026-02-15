import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 max-w-md mx-auto px-6 pb-8 pt-6">
      <div className="border-t border-[#E8D5E8]/30 pt-6">
        {/* 링크 */}
        <div className="flex items-center justify-center gap-3 mb-4 text-[11px]">
          <Link
            href="/terms"
            className="text-[#B8A0BC] hover:text-[#E879A4] transition-colors"
          >
            이용약관
          </Link>
          <span className="w-0.5 h-0.5 rounded-full bg-[#D4C0D8]" />
          <Link
            href="/privacy"
            className="text-[#B8A0BC] hover:text-[#E879A4] transition-colors"
          >
            개인정보처리방침
          </Link>
        </div>

        {/* 사업자 정보 */}
        <div className="text-center text-[10px] text-[#C4B0C8] leading-relaxed space-y-0.5">
          <p>[상호명] | 대표: [대표자명]</p>
          <p>사업자등록번호: [000-00-00000] | 통신판매업: [제0000-서울XX-0000호]</p>
          <p>[사업장 주소]</p>
          <p>문의: [email@example.com]</p>
        </div>

        {/* 저작권 */}
        <p className="text-center text-[10px] text-[#D4C0D8] mt-4">
          © 2025 너는내운멍. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
