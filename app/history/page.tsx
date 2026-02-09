"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHistory, clearHistory, type HistoryEntry } from "@/store/quizStore";
import { resultData } from "@/data/results";
import { breeds } from "@/data/breeds";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setLoaded(true);
  }, []);

  const handleClear = () => {
    if (confirm("모든 기록을 삭제할까요?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${h}:${min}`;
  };

  if (!loaded) return null;

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black">테스트 기록</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          돌아가기
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-500 font-medium mb-2">아직 기록이 없어요</p>
          <p className="text-sm text-gray-400 mb-6">테스트를 완료하면 여기에 기록이 저장돼요</p>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 bg-[#E879A4] text-white rounded-2xl font-bold text-sm hover:bg-[#D4658F] active:scale-[0.98] transition-all"
          >
            테스트 시작하기
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {history.map((entry) => {
              const result = resultData[entry.resultCode];
              const breed = breeds.find((b) => b.id === entry.breedId);
              if (!result) return null;

              return (
                <button
                  key={entry.id}
                  onClick={() => router.push(`/result/${entry.resultCode}`)}
                  className="w-full bg-white rounded-2xl p-4 text-left hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {entry.photoUrl ? (
                      <img
                        src={entry.photoUrl}
                        alt={entry.dogName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E879A4]/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                        {result.emoji}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{entry.dogName}</span>
                        <span className="text-xs font-black text-[#E879A4] tracking-wider">
                          {result.code}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{result.nickname}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{formatDate(entry.date)}</span>
                        {breed && (
                          <span className="text-[10px] text-gray-400">
                            · {breed.name}
                          </span>
                        )}
                        {entry.ownerName && (
                          <span className="text-[10px] text-gray-400">
                            · {entry.ownerName}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 text-sm">›</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => router.push("/profile")}
              className="flex-1 py-3 bg-[#E879A4] text-white rounded-2xl text-sm font-bold hover:bg-[#D4658F] active:scale-[0.98] transition-all"
            >
              새 테스트
            </button>
            <button
              onClick={handleClear}
              className="py-3 px-5 bg-white border-2 border-gray-200 text-gray-400 rounded-2xl text-sm font-bold hover:text-red-500 hover:border-red-200 transition-colors"
            >
              기록 삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}
