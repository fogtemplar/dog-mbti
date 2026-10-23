import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, setCors, setNoStore, setRequestId } from "../_lib/http";
import { readSession, setSessionCookie } from "../_lib/session";

export default function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  const requestId = setRequestId(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const session = readSession(req);
  if (!session) return res.status(401).json({ ok: false, code: "LOGIN_REQUIRED", requestId });
  const sessionToken = setSessionCookie(res, {
    userKey: session.userKey,
    name: session.name,
    premium: false,
  });
  return res.status(200).json({ ok: true, sessionToken });
}
