import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, safeErrorCode, setCors, setNoStore, setRequestId } from "../_lib/http";
import { readSession, setSessionCookie } from "../_lib/session";
import { getOrderStatus } from "../_lib/toss";
import { getIapSku } from "../_lib/config";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  const requestId = setRequestId(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const session = readSession(req);
  if (!session) return res.status(401).json({ ok: false, code: "LOGIN_REQUIRED", requestId });

  const orderId = (req.body as { orderId?: unknown } | undefined)?.orderId;
  const expectedSku = getIapSku();
  if (typeof orderId !== "string" || orderId.length < 8 || orderId.length > 200 || !expectedSku) {
    return res.status(400).json({ ok: false, code: "INVALID_GRANT_REQUEST", requestId });
  }

  try {
    const order = await getOrderStatus(orderId, session.userKey);
    const validStatus = order.status === "PAYMENT_COMPLETED" || order.status === "PURCHASED";
    if (order.sku !== expectedSku || !validStatus) {
      return res.status(409).json({ ok: false, code: "ORDER_NOT_GRANTABLE", requestId });
    }
    const sessionToken = setSessionCookie(res, {
      userKey: session.userKey,
      name: session.name,
      premium: true,
    });
    return res.status(200).json({ ok: true, sessionToken });
  } catch (error) {
    console.error(JSON.stringify({ event: "iap_order_verify_failed", requestId, code: safeErrorCode(error) }));
    return res.status(502).json({ ok: false, code: "ORDER_VERIFY_FAILED", requestId });
  }
}
