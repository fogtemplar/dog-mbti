/**
 * 공유 URL 페이로드 인코더/디코더
 *
 * v2 포맷 (JSON → base64url):
 *   { v:2, t:"SHXB", n:"뽀삐", o:"철수", b:"golden", m:"ENFP", p:[65,70,55,60], s:<hash> }
 *   키: v=version, t=type, n=name, o=owner, b=breed, m=ownerMbti, p=percentages(4개), s=signature
 *
 * p 배열: [SL좌측%, HC좌측%, XG좌측%, BA좌측%] — 4개 숫자
 */

// FNV-1a 32비트 해시 (간단 위변조 감지)
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

interface SharePayload {
  type: string;
  dogName: string;
  ownerName?: string;
  breedId?: string;
  ownerMbti?: string;
  /** [SL좌측%, HC좌측%, XG좌측%, BA좌측%] */
  pcts: number[];
}

/** 페이로드 → base64url 문자열 */
export function encodeSharePayload(data: SharePayload): string {
  const obj: Record<string, unknown> = {
    v: 2,
    t: data.type,
    n: data.dogName,
    p: data.pcts,
  };
  if (data.ownerName) obj.o = data.ownerName;
  if (data.breedId) obj.b = data.breedId;
  if (data.ownerMbti) obj.m = data.ownerMbti;

  // 서명 생성 (s 필드 제외한 JSON)
  const body = JSON.stringify(obj);
  obj.s = fnv1a(body);

  const json = JSON.stringify(obj);
  // base64url
  if (typeof window !== "undefined") {
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  return Buffer.from(json, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** base64url 문자열 → 페이로드 (위변조 시 null 반환) */
export function decodeSharePayload(encoded: string): SharePayload | null {
  try {
    // base64url → base64
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";

    let json: string;
    if (typeof window !== "undefined") {
      json = decodeURIComponent(escape(atob(b64)));
    } else {
      json = Buffer.from(b64, "base64").toString("utf-8");
    }

    const obj = JSON.parse(json);
    if (obj.v !== 2 || !obj.t || !obj.n) return null;

    // 서명 검증
    const sig = obj.s;
    delete obj.s;
    const body = JSON.stringify(obj);
    if (fnv1a(body) !== sig) return null;

    return {
      type: obj.t,
      dogName: obj.n,
      ownerName: obj.o || undefined,
      breedId: obj.b || undefined,
      ownerMbti: obj.m || undefined,
      pcts: Array.isArray(obj.p) ? obj.p : [50, 50, 50, 50],
    };
  } catch {
    return null;
  }
}

/** pcts 배열 → AxisPercentage[] 복원 */
export function pctArrayToPercentages(pcts: number[]) {
  const axes = ["SL", "HC", "XG", "BA"];
  const labels: [string, string][] = [
    ["사교적", "독립적"],
    ["활발", "차분"],
    ["호기심", "루틴"],
    ["주도", "순응"],
  ];
  return axes.map((axis, i) => {
    const leftPct = pcts[i] ?? 50;
    return {
      axis,
      left: { label: labels[i][0], pct: leftPct },
      right: { label: labels[i][1], pct: 100 - leftPct },
    };
  });
}

/** AxisPercentage[] → pcts 배열 (좌측 값만 추출) */
export function percentagesToPctArray(
  percentages: { left: { pct: number } }[]
): number[] {
  return percentages.map((p) => p.left.pct);
}
