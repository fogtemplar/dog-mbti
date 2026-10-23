"use client";

import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";
import { RESULT_INTERSTITIAL_AD_GROUP_ID } from "@/lib/aitMonetization";

let prepared: Promise<boolean> | null = null;

function supports(check: () => boolean) {
  try {
    return check() === true;
  } catch {
    return false;
  }
}

export function prepareResultInterstitial() {
  if (prepared) return prepared;
  prepared = new Promise<boolean>((resolve) => {
    if (!RESULT_INTERSTITIAL_AD_GROUP_ID || !supports(() => loadFullScreenAd.isSupported())) {
      resolve(false);
      return;
    }
    let settled = false;
    let cleanup = () => {};
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };
    cleanup = loadFullScreenAd({
      options: { adGroupId: RESULT_INTERSTITIAL_AD_GROUP_ID },
      onEvent: () => finish(true),
      onError: () => finish(false),
    });
    window.setTimeout(() => finish(false), 4_000);
  });
  return prepared;
}

export async function showResultInterstitial() {
  const isReady = await prepareResultInterstitial();
  prepared = null;
  if (!isReady || !supports(() => showFullScreenAd.isSupported())) return;

  await new Promise<void>((resolve) => {
    let settled = false;
    let cleanup = () => {};
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    cleanup = showFullScreenAd({
      options: { adGroupId: RESULT_INTERSTITIAL_AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === "dismissed" || event.type === "failedToShow") finish();
      },
      onError: finish,
    });
    window.setTimeout(finish, 8_000);
  });
}
