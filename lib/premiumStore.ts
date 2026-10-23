const STORAGE_KEY = "mungbti-premium";
const GLOBAL_ENTITLEMENT_KEY = "__all_reports__";

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

/** UI 캐시 전용입니다. 유료 콘텐츠 접근 권한은 /api/auth/me의 서명된 세션으로 확인합니다. */
export function hasCachedPremium(resultCode: string): boolean {
  const unlocks = loadUnlocks();
  return !!unlocks[GLOBAL_ENTITLEMENT_KEY] || !!unlocks[resultCode];
}

export function clearPremiumCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function unlockPremium(
  resultCode: string,
  dogName: string,
  ownerMbti?: string,
): void {
  const current = loadUnlocks();
  const entitlement = {
    unlockedAt: new Date().toISOString(),
    dogName,
    ownerMbti,
  };
  current[GLOBAL_ENTITLEMENT_KEY] = entitlement;
  // 이전 버전에서 결과 코드별 권한을 읽던 사용자와도 호환합니다.
  current[resultCode] = entitlement;
  saveUnlocks(current);
}
