import { createDecipheriv } from "node:crypto";
import { request } from "node:https";

const TOSS_HOST = "apps-in-toss-api.toss.im";
const TIMEOUT_MS = 8_000;

type TossEnvelope<T> =
  | { resultType: "SUCCESS"; success: T }
  | { resultType: string; error?: { errorCode?: string; reason?: string } };

type TokenResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
};

type UserResult = {
  userKey: number | string;
  scope: string;
  agreedTerms: string[];
  name?: string | null;
};

function requiredEnv(name: "TOSS_MTLS_CERT" | "TOSS_MTLS_PRIVATE_KEY") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value.replace(/\\n/g, "\n");
}

function callToss<T>(
  path: string,
  options: {
    method: "GET" | "POST";
    body?: unknown;
    accessToken?: string;
    userKey?: string;
  },
): Promise<TossEnvelope<T>> {
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);

  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: TOSS_HOST,
        port: 443,
        path,
        method: options.method,
        cert: requiredEnv("TOSS_MTLS_CERT"),
        key: requiredEnv("TOSS_MTLS_PRIVATE_KEY"),
        headers: {
          Accept: "application/json",
          ...(body
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(body),
              }
            : {}),
          ...(options.accessToken
            ? { Authorization: `Bearer ${options.accessToken}` }
            : {}),
          ...(options.userKey ? { "x-toss-user-key": options.userKey } : {}),
        },
        timeout: TIMEOUT_MS,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          try {
            const parsed = JSON.parse(raw) as TossEnvelope<T>;
            // Toss error responses are envelopes too. Let unwrap preserve the
            // documented errorCode instead of collapsing every 4xx/5xx.
            resolve(parsed);
          } catch {
            reject(
              new Error(
                (response.statusCode ?? 500) >= 400
                  ? `TOSS_HTTP_${response.statusCode ?? 500}`
                  : "TOSS_INVALID_RESPONSE",
              ),
            );
          }
        });
      },
    );

    req.on("timeout", () => req.destroy(new Error("TOSS_TIMEOUT")));
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function unwrap<T>(response: TossEnvelope<T>): T {
  if (response.resultType !== "SUCCESS" || !("success" in response)) {
    const code = "error" in response ? response.error?.errorCode : undefined;
    throw new Error(code ? `TOSS_API_${code}` : "TOSS_API_FAILED");
  }
  return response.success;
}

export async function exchangeAuthorizationCode(
  authorizationCode: string,
  referrer: "DEFAULT" | "SANDBOX",
) {
  return unwrap(
    await callToss<TokenResult>(
      "/api-partner/v1/apps-in-toss/user/oauth2/generate-token",
      { method: "POST", body: { authorizationCode, referrer } },
    ),
  );
}

export async function getLoginUser(accessToken: string) {
  return unwrap(
    await callToss<UserResult>(
      "/api-partner/v1/apps-in-toss/user/oauth2/login-me",
      { method: "GET", accessToken },
    ),
  );
}

export function decryptTossValue(value?: string | null) {
  if (!value) return undefined;
  const key = Buffer.from(
    (process.env.TOSS_LOGIN_DECRYPTION_KEY ?? "").trim(),
    "base64",
  );
  const aad = process.env.TOSS_LOGIN_AAD?.trim();
  if (key.length !== 32 || !aad) throw new Error("TOSS_DECRYPTION_NOT_CONFIGURED");
  const packed = Buffer.from(value, "base64");
  if (packed.length < 29) throw new Error("TOSS_INVALID_ENCRYPTED_VALUE");
  const decipher = createDecipheriv("aes-256-gcm", key, packed.subarray(0, 12));
  decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(packed.subarray(packed.length - 16));
  return Buffer.concat([
    decipher.update(packed.subarray(12, packed.length - 16)),
    decipher.final(),
  ]).toString("utf8");
}

type OrderStatus = {
  orderId: string;
  sku: string;
  status: string;
};

export async function getOrderStatus(orderId: string, userKey: string) {
  return unwrap(
    await callToss<OrderStatus>(
      "/api-partner/v1/apps-in-toss/order/get-order-status",
      { method: "POST", body: { orderId }, userKey },
    ),
  );
}

export async function disconnectUser(userKey: string) {
  return unwrap(
    await callToss<{ userKey: number | string }>(
      "/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key",
      { method: "POST", body: { userKey: Number(userKey) } },
    ),
  );
}
