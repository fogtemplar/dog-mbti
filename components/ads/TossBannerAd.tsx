"use client";

import { useEffect, useRef, useState } from "react";
import { TossAds } from "@apps-in-toss/web-framework";
import { BANNER_AD_GROUP_ID } from "@/lib/aitMonetization";

let initialized = false;
let initializing = false;
const readyListeners = new Set<() => void>();

function supports(check: () => boolean) {
  try {
    return check() === true;
  } catch {
    return false;
  }
}

function initializeAds(onReady: () => void) {
  if (initialized) return onReady();
  readyListeners.add(onReady);
  if (initializing || !supports(() => TossAds.initialize.isSupported())) return;
  initializing = true;
  TossAds.initialize({
    callbacks: {
      onInitialized: () => {
        initialized = true;
        initializing = false;
        readyListeners.forEach((listener) => listener());
        readyListeners.clear();
      },
      onInitializationFailed: () => {
        initializing = false;
        readyListeners.clear();
      },
    },
  });
}

export default function TossBannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(initialized);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!BANNER_AD_GROUP_ID) return;
    if (!supports(() => TossAds.initialize.isSupported())) {
      setHidden(true);
      return;
    }
    const onReady = () => setReady(true);
    initializeAds(onReady);
    return () => {
      readyListeners.delete(onReady);
    };
  }, []);

  useEffect(() => {
    if (!BANNER_AD_GROUP_ID || !ready || !containerRef.current) return;
    if (!supports(() => TossAds.attachBanner.isSupported())) {
      setHidden(true);
      return;
    }
    const slot = TossAds.attachBanner(BANNER_AD_GROUP_ID, containerRef.current, {
      theme: "light",
      tone: "blackAndWhite",
      variant: "expanded",
      callbacks: {
        onAdRendered: () => setHidden(false),
        onNoFill: () => setHidden(true),
        onAdFailedToRender: () => setHidden(true),
      },
    });
    return () => slot?.destroy();
  }, [ready]);

  if (!BANNER_AD_GROUP_ID) {
    return null;
  }
  if (hidden) return null;
  return <div ref={containerRef} className="mx-auto h-24 w-full max-w-md" aria-label="광고" />;
}
