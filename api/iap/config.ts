import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, setCors, setNoStore } from "../_lib/http";
import { getIapSku } from "../_lib/config";

export default function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  return res.status(200).json({ sku: getIapSku() ?? null });
}
