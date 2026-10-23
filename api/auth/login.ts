import type { ApiRequest, ApiResponse } from "../_lib/http";
import { handleOptions, methodNotAllowed, safeErrorCode, setCors, setNoStore, setRequestId } from "../_lib/http";
import { setSessionCookie } from "../_lib/session";
import { decryptTossValue, exchangeAuthorizationCode, getLoginUser } from "../_lib/toss";

type LoginBody = {
  authorizationCode?: unknown;
  referrer?: unknown;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setNoStore(res);
  setCors(req, res);
  const requestId = setRequestId(req, res);
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const body = (req.body ?? {}) as LoginBody;
  if (
    typeof body.authorizationCode !== "string" ||
    body.authorizationCode.length < 10 ||
    body.authorizationCode.length > 4096 ||
    (body.referrer !== "DEFAULT" && body.referrer !== "SANDBOX")
  ) {
    return res.status(400).json({ ok: false, code: "INVALID_LOGIN_REQUEST", requestId });
  }

  try {
    const token = await exchangeAuthorizationCode(
      body.authorizationCode,
      body.referrer,
    );
    const user = await getLoginUser(token.accessToken);
    const sessionToken = setSessionCookie(res, {
      userKey: String(user.userKey),
      name: decryptTossValue(user.name),
    });
    return res.status(200).json({ ok: true, sessionToken });
  } catch (error) {
    const code = safeErrorCode(error);
    console.error(JSON.stringify({ event: "auth_login_failed", requestId, code }));
    return res.status(502).json({ ok: false, code, requestId });
  }
}
