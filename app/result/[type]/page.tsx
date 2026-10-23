import { resultData } from "@/data/results";
import LegacyResultClient from "./LegacyResultClient";

export function generateStaticParams() {
  return Object.keys(resultData).map((type) => ({ type }));
}

export default function LegacyResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return <LegacyResultClient params={params} />;
}
