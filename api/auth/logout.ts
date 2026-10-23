import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, setCors, setNoStore } from "../_lib/http";
import { clearSessionCookie } from "../_lib/session";

export default function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
