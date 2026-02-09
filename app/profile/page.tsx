"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { setDogName, setPhotoUrl } = useQuizStore();
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      setPhotoUrl(base64);
    }
  };

  const handleStart = () => {
    if (!name.trim()) return;
    setDogName(name.trim());
    router.push("/quiz/intro");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6">
      <div className="text-5xl mb-6">🐶</div>
      <h1 className="text-2xl font-black mb-2">우리 아이 이름은?</h1>
      <p className="text-sm text-gray-500 mb-8">
        테스트 내내 이름으로 불러줄게요
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="예: 뽀삐, 초코, 콩이"
        maxLength={10}
        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg text-center font-medium focus:border-[#6C63FF] focus:outline-none transition-colors placeholder:text-gray-300"
        autoFocus
      />
      <p className="text-xs text-gray-400 mt-2 mb-8">최대 10자</p>

      {/* 사진 업로드 (선택) */}
      <div className="w-full mb-8">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhoto}
          className="hidden"
        />
        {preview ? (
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={preview}
              alt="강아지 사진"
              className="w-full h-full object-cover rounded-2xl"
            />
            <button
              onClick={() => {
                setPreview(null);
                setPhotoUrl(null);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-gray-400 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors"
          >
            📷 사진 등록 (선택사항)
          </button>
        )}
      </div>

      <button
        onClick={handleStart}
        disabled={!name.trim()}
        className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${
          name.trim()
            ? "bg-[#6C63FF] text-white hover:bg-[#5B54E6] active:scale-[0.98]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        시작하기
      </button>
    </div>
  );
}
