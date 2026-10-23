"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/apiUrl";
import { authHeaders, clearSessionToken } from "@/lib/authClient";
import { clearHistory } from "@/store/quizStore";

export default function AccountPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/auth/me"), { credentials: "include", headers: authHeaders(), cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setLoggedIn(data?.loggedIn === true);
        setName(typeof data?.name === "string" ? data.name : null);
      })
      .catch(() => setMessage("계정 상태를 확인하지 못했어요."));
  }, []);

  async function logout() {
    setBusy(true);
    await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include", headers: authHeaders() });
    clearSessionToken();
    setLoggedIn(false);
    setName(null);
    setBusy(false);
    setMessage("로그아웃했어요.");
  }

  async function unlink() {
    if (!window.confirm("토스 로그인 연결과 동의 정보를 해제할까요? 다시 이용하려면 재로그인이 필요해요.")) return;
    setBusy(true);
    setMessage("");
    const response = await fetch(apiUrl("/api/auth/unlink"), {
      method: "POST",
      credentials: "include",
      headers: authHeaders(),
    });
    if (response.ok) {
      clearSessionToken();
      setLoggedIn(false);
      setName(null);
      setMessage("토스 로그인 연결을 해제했어요.");
    } else {
      setMessage("연결을 해제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
    setBusy(false);
  }

  function deleteLocalData() {
    if (!window.confirm("이 기기에 저장된 테스트 기록과 사진을 모두 삭제할까요?")) return;
    clearHistory();
    localStorage.removeItem("mungbti-photo");
    localStorage.removeItem("mungbti-premium");
    clearSessionToken();
    setLoggedIn(false);
    setName(null);
    setMessage("이 기기에 저장된 데이터를 삭제했어요.");
  }

  return (
    <div className="ait-screen flex flex-col px-6">
      <button onClick={() => router.back()} className="mb-5 text-left text-sm text-[#8B95A1]">← 돌아가기</button>
      <h1 className="mb-2 text-2xl font-black">계정 및 데이터 관리</h1>
      <p className="mb-6 text-sm leading-6 text-[#6B7684]">
        로그인 연결과 이 기기에 저장된 테스트 기록을 관리할 수 있어요.
      </p>

      <section className="ait-card mb-4 p-5">
        <p className="mb-1 text-sm font-bold">토스 로그인</p>
        <p className="mb-4 text-sm text-[#6B7684]">
          {loggedIn ? `${name ? `${name}님으로 ` : ""}연결되어 있어요.` : "현재 로그인되어 있지 않아요."}
        </p>
        {loggedIn ? (
          <div className="flex flex-col gap-2">
            <button disabled={busy} onClick={logout} className="ait-touch-target rounded-xl bg-[#F2F4F6] text-sm font-semibold">로그아웃</button>
            <button disabled={busy} onClick={unlink} className="ait-touch-target rounded-xl border border-[#F04452]/20 text-sm font-semibold text-[#F04452]">토스 로그인 연결 해제</button>
          </div>
        ) : (
          <Link href="/" className="ait-touch-target flex items-center justify-center rounded-xl bg-[#3182F6] text-sm font-semibold text-white">홈에서 토스로 로그인</Link>
        )}
      </section>

      <section className="ait-card p-5">
        <p className="mb-1 text-sm font-bold">기기 저장 데이터</p>
        <p className="mb-4 text-sm leading-5 text-[#6B7684]">테스트 기록, 반려견 사진, 리포트 열람 기록과 이 기기의 로그인 세션을 삭제해요.</p>
        <button onClick={deleteLocalData} className="ait-touch-target w-full rounded-xl border border-[#F04452]/20 text-sm font-semibold text-[#F04452]">기기 데이터 모두 삭제</button>
      </section>

      {message && <p className="mt-4 text-center text-sm text-[#6B7684]" role="status">{message}</p>}
    </div>
  );
}
