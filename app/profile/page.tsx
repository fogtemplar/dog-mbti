"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { breedGroups } from "@/data/breeds";

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
  const { setDogName, setOwnerName, setBreedId, setOwnerMbti, setPhotoUrl } = useQuizStore();
  const [name, setName] = useState("");
  const [ownerNameInput, setOwnerNameInput] = useState("");
  const [breed, setBreed] = useState("");
  const [mbti, setMbti] = useState(["", "", "", ""]);
  const [preview, setPreview] = useState<string | null>(null);
  const [showBreedPicker, setShowBreedPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const mbtiAxes = [
    { index: 0, options: [{ letter: "E", label: "외향" }, { letter: "I", label: "내향" }] },
    { index: 1, options: [{ letter: "S", label: "감각" }, { letter: "N", label: "직관" }] },
    { index: 2, options: [{ letter: "T", label: "사고" }, { letter: "F", label: "감정" }] },
    { index: 3, options: [{ letter: "J", label: "판단" }, { letter: "P", label: "인식" }] },
  ];
  const mbtiComplete = mbti.every((m) => m !== "");
  const mbtiCode = mbtiComplete ? mbti.join("") : "";

  const selectedBreed = breedGroups
    .flatMap((g) => g.breeds)
    .find((b) => b.id === breed);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      setPhotoUrl(base64);
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
        <input
          ref={fileRef}
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
              className="w-28 h-28 object-cover rounded-full border-4 border-[#6C63FF]/20"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#6C63FF] text-white rounded-full text-sm flex items-center justify-center shadow-lg"
            >
              📷
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setPhotoUrl(null);
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 text-white rounded-full text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors mb-4"
          >
            <span className="text-2xl mb-1">📷</span>
            <span className="text-[10px]">사진 (선택)</span>
          </button>
        )}

        <h1 className="text-xl font-black mb-4">우리 아이 이름은?</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 뽀삐, 초코, 콩이"
          maxLength={10}
          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg text-center font-medium focus:border-[#6C63FF] focus:outline-none transition-colors placeholder:text-gray-300"
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
              ? "border-[#6C63FF] text-gray-800"
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
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-[#6C63FF]/5 transition-colors border-b border-gray-50 ${
                      breed === b.id
                        ? "bg-[#6C63FF]/10 text-[#6C63FF] font-bold"
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
          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium focus:border-[#6C63FF] focus:outline-none transition-colors placeholder:text-gray-300"
        />
      </div>

      {/* 견주 MBTI 선택 */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-1">견주님의 MBTI는?</h2>
        <p className="text-xs text-gray-400 mb-3">선택하면 결과에서 궁합을 분석해 드려요 (선택)</p>
        <div className="grid grid-cols-4 gap-2">
          {mbtiAxes.map((axis) => (
            <div key={axis.index} className="flex flex-col gap-1.5">
              {axis.options.map((opt) => (
                <button
                  key={opt.letter}
                  onClick={() => {
                    const next = [...mbti];
                    next[axis.index] = opt.letter;
                    setMbti(next);
                  }}
                  className={`py-2.5 rounded-xl text-center transition-all ${
                    mbti[axis.index] === opt.letter
                      ? "bg-[#6C63FF] text-white font-bold shadow-md"
                      : "bg-white border-2 border-gray-200 text-gray-500 hover:border-[#6C63FF]/30"
                  }`}
                >
                  <span className="text-base font-black">{opt.letter}</span>
                  <span className="text-[10px] block -mt-0.5">{opt.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        {mbtiComplete && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-[#6C63FF] font-bold">
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
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${
            canStart
              ? "bg-[#6C63FF] text-white hover:bg-[#5B54E6] active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
