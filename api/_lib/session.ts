import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { ApiRequest, ApiResponse } from "./http";

const COOKIE_NAME = "dogandme_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionPayload = {
  userKey: string;
  name?: string;
  premium?: boolean;
  exp: number;
};

function secret() {
  const value = process.env.TOSS_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("TOSS_SESSION_SECRET is not configured");
  }
  return value;
}

function encryptionKey() {
  return createHash("sha256").update(secret()).digest();
}

export function createSession(payload: Omit<SessionPayload, "exp">) {
  const session: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function readSession(req: ApiRequest): SessionPayload | null {
  const authorization = req.headers.authorization;
  const bearer = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : undefined;
  const cookies = req.headers.cookie?.split(";") ?? [];
  const cookie = cookies
    .map((cookie) => cookie.trim().split("="))
    .find(([name]) => name === COOKIE_NAME)?.[1];
  const raw = bearer || cookie;

  if (!raw) return null;
  try {
    const packed = Buffer.from(raw, "base64url");
    if (packed.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), packed.subarray(0, 12));
    decipher.setAuthTag(packed.subarray(12, 28));
    const payload = JSON.parse(
      Buffer.concat([decipher.update(packed.subarray(28)), decipher.final()]).toString("utf8"),
    ) as SessionPayload;
    if (!payload.userKey || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(
  res: ApiResponse,
  payload: Omit<SessionPayload, "exp">,
) {
  const token = createSession(payload);
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=None`,
  );
  return token;
}

export function clearSessionCookie(res: ApiResponse) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None`,
  );
}
