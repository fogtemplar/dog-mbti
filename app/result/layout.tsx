import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "너는내운멍 - 결과",
  description: "우리 강아지의 성향 테스트 결과를 확인해 보세요.",
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
