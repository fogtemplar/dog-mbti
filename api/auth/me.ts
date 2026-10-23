import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, setCors, setNoStore } from "../_lib/http";
import { readSession } from "../_lib/session";

export default function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const session = readSession(req);
  return res.status(200).json({
    ok: true,
    loggedIn: session !== null,
    name: session?.name ?? null,
    premium: session?.premium === true,
  });
}
