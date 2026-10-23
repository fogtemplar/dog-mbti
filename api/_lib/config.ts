export function getIapSku() {
  const value = process.env.TOSS_IAP_SKU?.replace(/^\uFEFF/, "").trim();
  return value || undefined;
}
