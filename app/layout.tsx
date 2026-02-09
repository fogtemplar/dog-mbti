import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "멍BTI - 우리 강아지 성향 테스트",
  description:
    "사진 업로드와 보호자 관찰 질문으로 알아보는 강아지 MBTI 성향 테스트. 16가지 타입 중 우리 아이는?",
  openGraph: {
    title: "멍BTI - 우리 강아지 성향 테스트",
    description: "우리 강아지는 어떤 성향일까? 20개 질문으로 알아보세요!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-[#FFF9F0]">
        <main className="max-w-md mx-auto min-h-dvh">{children}</main>
      </body>
    </html>
  );
}
