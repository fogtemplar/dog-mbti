import type { Metadata } from "next";
import { resultData } from "@/data/results";

interface Props {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const result = resultData[type];

  if (!result) {
    return { title: "너는내운멍 - 결과" };
  }

  const title = `${result.emoji} ${result.code} - ${result.nickname} | 너는내운멍`;
  const description = result.summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "너는내운멍 - 강아지 성향 테스트",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
