"use client";

import { Suspense, use } from "react";
import ResultPageContent from "@/components/ResultPageContent";

export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  return (
    <Suspense fallback={null}>
      <ResultPageContent initialType={type} />
    </Suspense>
  );
}
