"use client";

import { useEffect, useState } from "react";
import { TossAuth } from "@apps-in-toss/web-framework";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/apiUrl";
import { authHeaders, setSessionToken } from "@/lib/authClient";

type LoginState = "checking" | "logged-out" | "logging-in" | "logged-in";

function errorDetails(error: unknown) {
  if (!(error instanceof Error)) return String(error || "UNKNOWN");
  return ["code" in error ? String(error.code) : "", error.message, error.name]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" / ");
}

export default function TossLoginButton() {
  const router = useRouter();
  const [state, setState] = useState<LoginState>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6_000);
    fetch(apiUrl("/api/auth/me"), { credentials: "include", headers: authHeaders(), signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const isLoggedIn = data?.loggedIn === true;
        setState(isLoggedIn ? "logged-in" : "logged-out");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setState("logged-out");
        }
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  async function login() {
    setState("logging-in");
    setMessage("");
    try {
      const result = await TossAuth.login();
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const serverError = new Error(body?.code || "LOGIN_FAILED") as Error & { code?: string };
        serverError.code = body?.code || "LOGIN_FAILED";
        throw serverError;
      }
      const body = await response.json();
      if (typeof body.sessionToken !== "string") throw new Error("SESSION_TOKEN_MISSING");
      setSessionToken(body.sessionToken);
      setState("logged-in");
      router.push("/profile");
    } catch (error) {
      setState("logged-out");
      const isLocalPreview =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");
      const details = errorDetails(error);
      setMessage(
        isLocalPreview
          ? "토스 로그인은 콘솔 테스트 QR에서 확인할 수 있어요."
          : `로그인을 완료하지 못했어요. 토스 앱을 최신 버전으로 업데이트한 뒤 다시 시도해 주세요. (${details})`,
      );
    }
  }

  function handleClick() {
    if (state === "logged-in") {
      router.push("/profile");
      return;
    }
    void login();
  }

  if (state === "checking") {
    return (
      <button disabled className="ait-primary-button btn-cute w-full" aria-label="로그인 상태 확인 중">
        로그인 상태 확인 중...
      </button>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "logging-in"}
        className="ait-primary-button btn-cute w-full"
      >
        {state === "logging-in"
          ? "토스로 로그인 중..."
          : "우리 강아지 성향 알아보기 🐾"}
      </button>
      {message && (
        <p className="mt-2 text-xs leading-5 text-[#8B7A8E]" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
