"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  ownerName?: string;
  dogName: string;
  resultCode: string;
  onContinue: () => void;
};

export default function PremiumPromptModal({ ownerName, dogName, resultCode, onContinue }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = `dogandme-premium-prompt:${resultCode}`;
    if (window.sessionStorage.getItem(key) === "1") return;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(key, "1");
      setOpen(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [resultCode]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 px-4 pb-[max(20px,env(safe-area-inset-bottom))] sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div ref={dialogRef} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="premium-prompt-title">
        <button type="button" onClick={() => setOpen(false)} className="ait-touch-target -mr-2 -mt-2 ml-auto flex items-center justify-center text-xl text-[#8B95A1]" aria-label="닫기">×</button>
        <div className="mb-3 text-center text-5xl">📋</div>
        <h2 id="premium-prompt-title" className="text-center text-xl font-black leading-7">
          {ownerName ? `${ownerName}님,` : "보호자님,"}<br />{dogName}의 마음이 더 궁금하지 않으세요?
        </h2>
        <p className="mt-3 text-center text-sm leading-6 text-[#6B7684]">
          {dogName}가 왜 이런 행동을 하는지, 어떻게 놀아주고 돌봐주면 좋은지 맞춤 리포트로 알려드릴게요.
        </p>
        <div className="my-5 grid grid-cols-2 gap-2 text-xs font-semibold text-[#4E5968]">
          <div className="rounded-xl bg-[#FFF5F9] p-3">📊 상세 성향 분석</div>
          <div className="rounded-xl bg-[#FFF5F9] p-3">🎯 맞춤 훈련 팁</div>
          <div className="rounded-xl bg-[#FFF5F9] p-3">🚶 산책·놀이 추천</div>
          <div className="rounded-xl bg-[#FFF5F9] p-3">🚨 스트레스 신호</div>
        </div>
        <button type="button" onClick={onContinue} className="ait-primary-button w-full">{dogName} 맞춤 리포트 열기 · 990원</button>
        <p className="mt-2 text-center text-[11px] text-[#8B95A1]">일회성 인앱결제 · 구매 후 모든 성향 리포트 이용</p>
        <button type="button" onClick={() => setOpen(false)} className="ait-touch-target mt-1 w-full text-sm text-[#8B95A1]">지금은 결과만 볼게요</button>
      </div>
    </div>
  );
}
