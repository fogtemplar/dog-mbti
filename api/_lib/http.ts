import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";

export type ApiRequest = IncomingMessage & {
  body?: unknown;
  method?: string;
};

export type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  send(body: string): void;
};

export function setNoStore(res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
}

export function setRequestId(req: ApiRequest, res: ApiResponse) {
  const incoming = req.headers["x-request-id"];
  const requestId =
    typeof incoming === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(incoming)
      ? incoming
      : randomUUID();
  res.setHeader("X-Request-Id", requestId);
  return requestId;
}

export function safeErrorCode(error: unknown) {
  if (!(error instanceof Error)) return "UNKNOWN";
  const code = "code" in error ? String(error.code) : "";
  const candidate = code || error.message || error.name;
  const normalized = candidate
    .toUpperCase()
    .replace(/[^A-Z0-9:_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
  return normalized.length >= 3 ? normalized : "UNKNOWN_ERROR";
}

export function setCors(req: ApiRequest, res: ApiResponse) {
  const origin = req.headers.origin;
  const allowed =
    origin === "null" ||
    origin === "https://dogandme.vercel.app" ||
    origin === "https://mydogtype.apps.tossmini.com" ||
    origin === "https://mydogtype.private-apps.tossmini.com" ||
    origin === "http://localhost:3000" ||
    origin === "http://127.0.0.1:4175" ||
    origin === "http://127.0.0.1:4176" ||
    (typeof origin === "string" && /^https:\/\/[^/]+\.(?:toss\.im|apps-in-toss\.com)$/.test(origin));
  if (origin && allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

export function handleOptions(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "OPTIONS") return false;
  res.status(204).end();
  return true;
}

export function methodNotAllowed(res: ApiResponse, allowed: string[]) {
  res.setHeader("Allow", allowed.join(", "));
  return res.status(405).json({ ok: false, code: "METHOD_NOT_ALLOWED" });
}
