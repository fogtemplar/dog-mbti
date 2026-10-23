"use client";

import { Suspense, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { encodeSharePayload } from "@/lib/sharePayload";

export default function LegacyResultClient({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <LegacyResultRedirect params={params} />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce-slow">🐾</div>
        <p className="text-sm text-gray-500">결과 페이지로 이동 중...</p>
      </div>
    </div>
  );
}

function LegacyResultRedirect({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const dogName = searchParams.get("dog") || "강아지";
    const ownerName = searchParams.get("owner") || undefined;
    const breedId = searchParams.get("breed") || undefined;
    const ownerMbti = searchParams.get("ombt") || undefined;
    const d = encodeSharePayload({
      type,
      dogName,
      ownerName,
      breedId,
      ownerMbti,
      pcts: [50, 50, 50, 50],
    });

    router.replace(`/result?d=${d}`);
  }, [type, searchParams, router]);

  return <Loading />;
}
