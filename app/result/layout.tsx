import type { Metadata } from "next";
import { resultData } from "@/data/results";
import { decodeSharePayload } from "@/lib/sharePayload";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ d?: string; [key: string]: string | string[] | undefined }>;
  children: React.ReactNode;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolved = await searchParams;
  const d = resolved?.d;

  if (!d || typeof d !== "string") {
    return { title: "너는내운멍 - 결과" };
  }

  const shared = decodeSharePayload(d);
  if (!shared) {
    return { title: "너는내운멍 - 결과" };
  }

  const result = resultData[shared.type];
  if (!result) {
    return { title: "너는내운멍 - 결과" };
  }

  const title = `${result.emoji} ${shared.dogName}는 ${result.nickname}! | 너는내운멍`;
  const description = `${shared.dogName}의 너는내운멍 결과: ${result.code} (${result.nickname}) - ${result.summary}`;

  const ogImage = `https://www.daeng.me/api/og?d=${encodeURIComponent(d)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "너는내운멍 - 강아지 성향 테스트",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
