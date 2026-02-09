export interface AxisPercentage {
  axis: string;
  left: { label: string; pct: number };
  right: { label: string; pct: number };
}

const AXIS_ORDER = ["SL", "HC", "XG", "BA"] as const;
const AXIS_LABELS: Record<string, [string, string]> = {
  SL: ["사교적", "독립적"],
  HC: ["활발", "차분"],
  XG: ["호기심", "루틴"],
  BA: ["주도", "순응"],
};

export interface SharePayloadV1 {
  v: 1;
  t: string;
  d?: string;
  o?: string;
  b?: string;
  m?: string;
  p?: AxisPercentage[];
}

export interface SharePayloadV2 {
  v: 2;
  t: string;
  d?: string;
  o?: string;
  b?: string;
  m?: string;
  p?: string | number[];
  s?: string;
}

export type SharePayload = SharePayloadV1 | SharePayloadV2;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.btoa === "function";
}

function base64UrlEncode(input: string): string {
  const b64 = isBrowser()
    ? window.btoa(unescape(encodeURIComponent(input)))
    : Buffer.from(input, "utf8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4;
  const normalized = (input + "===".slice(0, pad ? 4 - pad : 0))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const str = isBrowser()
    ? window.atob(normalized)
    : Buffer.from(normalized, "base64").toString("utf8");
  return isBrowser()
    ? decodeURIComponent(escape(str))
    : str;
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  const b64 = isBrowser()
    ? window.btoa(String.fromCharCode(...bytes))
    : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeBytes(input: string): Uint8Array {
  const pad = input.length % 4;
  const normalized = (input + "===".slice(0, pad ? 4 - pad : 0))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const bytes = isBrowser()
    ? Uint8Array.from(window.atob(normalized), (c) => c.charCodeAt(0))
    : new Uint8Array(Buffer.from(normalized, "base64"));
  return bytes;
}

function fnv1aHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = (hash >>> 0) * 0x01000193;
  }
  return (hash >>> 0).toString(36);
}

function signPayload(payload: Omit<SharePayloadV2, "s">): string {
  return fnv1aHash(JSON.stringify(payload));
}

export function packPercentages(percentages?: AxisPercentage[]): number[] {
  if (!percentages || percentages.length === 0) return [];
  const map = new Map(percentages.map((p) => [p.axis, p.left.pct]));
  return AXIS_ORDER.map((axis) => {
    const pct = map.get(axis) ?? 50;
    return Math.max(0, Math.min(100, Math.round(pct)));
  });
}

export function packPercentagesCompact(percentages?: AxisPercentage[]): string | undefined {
  const packed = packPercentages(percentages);
  if (packed.length === 0) return undefined;
  return base64UrlEncodeBytes(Uint8Array.from(packed.slice(0, 4)));
}

export function unpackPercentages(packed?: number[] | string): AxisPercentage[] | undefined {
  if (!packed || (Array.isArray(packed) && packed.length === 0)) return undefined;
  const arr = Array.isArray(packed)
    ? packed
    : Array.from(base64UrlDecodeBytes(packed));
  return AXIS_ORDER.map((axis, idx) => {
    const [leftLabel, rightLabel] = AXIS_LABELS[axis];
    const leftPct = typeof arr[idx] === "number" ? arr[idx] : 50;
    return {
      axis,
      left: { label: leftLabel, pct: leftPct },
      right: { label: rightLabel, pct: Math.max(0, Math.min(100, 100 - leftPct)) },
    };
  });
}

export function encodeSharePayload(payload: SharePayloadV1): string {
  const v2: Omit<SharePayloadV2, "s"> = {
    v: 2,
    t: payload.t,
    d: payload.d || undefined,
    o: payload.o || undefined,
    b: payload.b || undefined,
    m: payload.m || undefined,
    p: packPercentagesCompact(payload.p),
  };
  if (!v2.p || v2.p.length === 0) delete v2.p;
  if (!v2.d) delete v2.d;
  if (!v2.o) delete v2.o;
  if (!v2.b) delete v2.b;
  if (!v2.m) delete v2.m;
  const signed: SharePayloadV2 = { ...v2, s: signPayload(v2) };
  return base64UrlEncode(JSON.stringify(signed));
}

export function decodeSharePayload(raw: string | null): SharePayloadV1 | null {
  if (!raw) return null;
  try {
    const json = base64UrlDecode(raw);
    const parsed = JSON.parse(json) as SharePayload;
    if (!parsed || !parsed.t) return null;
    if (parsed.v === 2) {
      const { s, ...unsigned } = parsed as SharePayloadV2;
      if (!s || signPayload(unsigned) !== s) return null;
      return {
        v: 1,
        t: parsed.t,
        d: parsed.d,
        o: parsed.o,
        b: parsed.b,
        m: parsed.m,
        p: unpackPercentages(parsed.p),
      };
    }
    if (parsed.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}
