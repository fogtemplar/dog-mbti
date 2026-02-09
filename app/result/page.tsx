import type { Metadata } from "next";
import { Suspense } from "react";
import ResultPageContent from "@/components/ResultPageContent";
import { decodeSharePayload } from "@/lib/share";
import { resultData } from "@/data/results";
import { fillName } from "@/lib/calculate";

interface ResultPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const raw = typeof searchParams?.d === "string" ? searchParams.d : undefined;
  const payload = decodeSharePayload(raw ?? null);
  const result = payload ? resultData[payload.t] : undefined;

  if (!payload || !result) {
    return { title: "멍BTI - 결과" };
  }

  const dogName = payload.d || "강아지";
  const title = `${dogName}의 멍BTI 결과 - ${result.code} ${result.nickname}`;
  const description = fillName(result.summary, dogName);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dog-mbti-taupe.vercel.app";
  const imageUrl = `${baseUrl}/api/og?d=${encodeURIComponent(raw || "")}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "멍BTI - 강아지 성향 테스트",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${dogName}의 멍BTI 결과` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function ResultIndexPage({ searchParams }: ResultPageProps) {
  const raw = typeof searchParams?.d === "string" ? searchParams.d : undefined;
  const payload = decodeSharePayload(raw ?? null);
  return (
    <Suspense fallback={null}>
      <ResultPageContent initialPayload={payload} />
    </Suspense>
  );
}
