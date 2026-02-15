const STORAGE_KEY = "mungbti-premium";

interface PremiumUnlockEntry {
  unlockedAt: string;
  dogName: string;
  ownerMbti?: string;
}

type PremiumUnlocks = Record<string, PremiumUnlockEntry>;

function loadUnlocks(): PremiumUnlocks {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUnlocks(data: PremiumUnlocks): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota exceeded */
  }
}

export function isPremiumUnlocked(resultCode: string): boolean {
  return !!loadUnlocks()[resultCode];
}

export function unlockPremium(
  resultCode: string,
  dogName: string,
  ownerMbti?: string,
): void {
  const current = loadUnlocks();
  current[resultCode] = {
    unlockedAt: new Date().toISOString(),
    dogName,
    ownerMbti,
  };
  saveUnlocks(current);
}
