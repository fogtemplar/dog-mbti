import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, safeErrorCode, setCors, setNoStore, setRequestId } from "../_lib/http";
import { clearSessionCookie, readSession } from "../_lib/session";
import { disconnectUser } from "../_lib/toss";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  const requestId = setRequestId(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const session = readSession(req);
  if (!session) return res.status(401).json({ ok: false, code: "LOGIN_REQUIRED", requestId });

  try {
    await disconnectUser(session.userKey);
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ event: "auth_unlink_failed", requestId, code: safeErrorCode(error) }));
    return res.status(502).json({ ok: false, code: "TOSS_UNLINK_FAILED", requestId });
  }
}
