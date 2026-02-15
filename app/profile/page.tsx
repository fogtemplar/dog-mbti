"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { breedGroups } from "@/data/breeds";

const PHOTO_STORAGE_KEY = "mungbti-photo";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageToDataUrl(dataUrl: string, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { setDogName, setOwnerName, setBreedId, setOwnerMbti, setPhotoUrl } = useQuizStore();
  const [name, setName] = useState("");
  const [ownerNameInput, setOwnerNameInput] = useState("");
  const [breed, setBreed] = useState("");
  const [mbti, setMbti] = useState(["", "", "", ""]);
  const [preview, setPreview] = useState<string | null>(null);
  const [showBreedPicker, setShowBreedPicker] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const mbtiAxes = [
    { index: 0, axis: "에너지", color: "#E879A4", options: [{ letter: "E", label: "외향" }, { letter: "I", label: "내향" }] },
    { index: 1, axis: "인식", color: "#F59E0B", options: [{ letter: "S", label: "감각" }, { letter: "N", label: "직관" }] },
    { index: 2, axis: "판단", color: "#10B981", options: [{ letter: "T", label: "사고" }, { letter: "F", label: "감정" }] },
    { index: 3, axis: "생활", color: "#8B5CF6", options: [{ letter: "J", label: "계획" }, { letter: "P", label: "탐색" }] },
  ];
  const mbtiComplete = mbti.every((m) => m !== "");
  const mbtiCode = mbtiComplete ? mbti.join("") : "";

  const selectedBreed = breedGroups
    .flatMap((g) => g.breeds)
    .find((b) => b.id === breed);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PHOTO_STORAGE_KEY);
      if (saved) {
        setPreview(saved);
        setPhotoUrl(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, [setPhotoUrl]);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const resized = await resizeImageToDataUrl(base64, 512, 0.7);
      setPreview(resized);
      setPhotoUrl(resized);
      try {
        localStorage.setItem(PHOTO_STORAGE_KEY, resized);
      } catch {
        // ignore storage quota errors
      }
    }
  };

  const handleStart = () => {
    if (!name.trim() || !breed) return;
    setDogName(name.trim());
    setOwnerName(ownerNameInput.trim());
    setBreedId(breed);
    setOwnerMbti(mbtiCode);
    router.push("/quiz/intro");
  };

  const canStart = name.trim() && breed;

  return (
    <div className="flex flex-col min-h-dvh px-6 py-10">
      {/* 사진 + 이름 */}
      <div className="flex flex-col items-center mb-8">
        {/* 앨범 선택용 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          className="hidden"
        />
        {/* 카메라 촬영용 */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhoto}
          className="hidden"
        />
        {preview ? (
          <div className="relative mb-4">
            <img
              src={preview}
              alt="강아지 사진"
              className="w-28 h-28 object-cover rounded-full border-4 border-[#E879A4]/20"
            />
            <button
              onClick={() => setShowPhotoMenu(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E879A4] text-white rounded-full text-sm flex items-center justify-center shadow-lg"
            >
              📷
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setPhotoUrl(null);
                try {
                  localStorage.removeItem(PHOTO_STORAGE_KEY);
                } catch {
                  // ignore
                }
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 text-white rounded-full text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPhotoMenu(true)}
            className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#E879A4] hover:text-pink-500 transition-colors mb-4"
          >
            <span className="text-2xl mb-1">📷</span>
            <span className="text-[10px]">사진 (선택)</span>
          </button>
        )}

        {/* 사진 선택 메뉴 */}
        {showPhotoMenu && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowPhotoMenu(false)}>
            <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <p className="text-base font-bold text-center mb-4">사진 등록</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setShowPhotoMenu(false); cameraRef.current?.click(); }}
                  className="w-full py-4 bg-[#E879A4] text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
                >
                  📸 카메라로 촬영
                </button>
                <button
                  onClick={() => { setShowPhotoMenu(false); fileRef.current?.click(); }}
                  className="w-full py-4 bg-white border-2 border-[#E879A4] text-[#E879A4] rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
                >
                  🖼️ 앨범에서 선택
                </button>
                <button
                  onClick={() => setShowPhotoMenu(false)}
                  className="w-full py-3 text-gray-400 text-sm"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mb-4 leading-relaxed text-center">
          사진을 등록하면 우리 아이 사진이 들어간<br />세상에 하나뿐인 너는내운멍 카드를 만들 수 있어요!
        </p>

        <h1 className="text-xl font-black mb-4">우리 아이 이름은?</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 뽀삐, 초코, 콩이"
          maxLength={10}
          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg text-center font-medium focus:border-[#E879A4] focus:outline-none transition-colors placeholder:text-gray-300"
          autoFocus
        />
        <p className="text-xs text-gray-400 mt-1">최대 10자</p>
      </div>

      {/* 견종 선택 */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-3">견종을 알려주세요</h2>
        <button
          onClick={() => setShowBreedPicker(!showBreedPicker)}
          className={`w-full px-5 py-4 bg-white border-2 rounded-2xl text-left transition-colors ${
            breed
              ? "border-[#E879A4] text-gray-800"
              : "border-gray-200 text-gray-400"
          }`}
        >
          {selectedBreed ? (
            <span className="font-medium">{selectedBreed.name}</span>
          ) : (
            "견종을 선택해 주세요"
          )}
          <span className="float-right">{showBreedPicker ? "▲" : "▼"}</span>
        </button>

        {showBreedPicker && (
          <div className="mt-2 bg-white border-2 border-gray-100 rounded-2xl max-h-72 overflow-y-auto shadow-lg">
            {breedGroups.map((group) => (
              <div key={group.label}>
                <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 sticky top-0">
                  {group.label}
                </div>
                {group.breeds.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBreed(b.id);
                      setShowBreedPicker(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-[#E879A4]/5 transition-colors border-b border-gray-50 ${
                      breed === b.id
                        ? "bg-[#E879A4]/10 text-[#E879A4] font-bold"
                        : ""
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 견주 이름 */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-1">견주님 이름 (선택)</h2>
        <p className="text-xs text-gray-400 mb-3">입력하면 결과에 견주님 이름이 표시돼요</p>
        <input
          type="text"
          value={ownerNameInput}
          onChange={(e) => setOwnerNameInput(e.target.value)}
          placeholder="예: 홍길동"
          maxLength={10}
          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:border-[#E879A4] focus:outline-none transition-colors placeholder:text-gray-300"
        />
      </div>

      {/* 견주 MBTI 선택 */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-1">견주님의 MBTI는?</h2>
        <p className="text-xs text-gray-400 mb-3">선택하면 결과에서 궁합을 분석해 드려요 (선택)</p>
        <div className="grid grid-cols-4 gap-2">
          {mbtiAxes.map((axis) => (
            <div key={axis.index} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 mb-1.5">{axis.axis}</span>
              <div className="w-full bg-gray-100 rounded-2xl p-1 flex flex-col gap-1">
                {axis.options.map((opt) => {
                  const isSelected = mbti[axis.index] === opt.letter;
                  return (
                    <button
                      key={opt.letter}
                      onClick={() => {
                        const next = [...mbti];
                        next[axis.index] = opt.letter;
                        setMbti(next);
                      }}
                      className={`w-full py-2.5 rounded-xl text-center transition-all border-2 ${
                        isSelected
                          ? "text-white font-bold shadow-md border-transparent"
                          : "bg-white/60 hover:bg-white"
                      }`}
                      style={
                        isSelected
                          ? { backgroundColor: axis.color }
                          : { borderColor: `${axis.color}40`, color: axis.color }
                      }
                    >
                      <span className="text-base font-black">{opt.letter}</span>
                      <span className="text-[10px] block -mt-0.5">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {mbtiComplete && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-[#E879A4] font-bold">
              {mbtiCode} 유형이시군요!
            </p>
            <button
              onClick={() => setMbti(["", "", "", ""])}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              초기화
            </button>
          </div>
        )}
      </div>

      {/* 시작 버튼 */}
      <div className="mt-auto">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4 rounded-full text-lg font-bold transition-all ${
            canStart
              ? "bg-gradient-to-r from-[#E879A4] to-[#C084FC] text-white hover:shadow-lg hover:shadow-pink-200/50 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={canStart ? { boxShadow: "0 4px 20px rgba(232,121,164,0.3)" } : undefined}
        >
          시작하기 💕
        </button>
      </div>
    </div>
  );
}
