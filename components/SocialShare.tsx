"use client";

import { useCallback, useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  dogName: string;
  captureCard: () => Promise<Blob | null>;
}

function enc(s: string) {
  return encodeURIComponent(s);
}

/* ── 플랫폼별 SVG 아이콘 ── */
function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.66 6.62l-.96 3.54c-.08.28.24.52.48.36l4.2-2.78c.52.06 1.06.1 1.62.1 5.52 0 10-3.58 10-7.84S17.52 3 12 3z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="#fff" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="#fff" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
      <path d="M12.186 24h-.007C5.461 23.956.057 18.494 0 11.762c0-.076.017-.15.048-.22C.56 5.127 5.745.11 12.007.11c6.239 0 11.386 4.988 11.94 11.332.032.074.05.153.05.236-.058 6.702-5.433 12.157-12.104 12.322h.293zm-.297-2.03c5.07-.148 9.144-4.174 9.573-9.282-.388-5.156-4.49-9.22-9.576-9.22-5.107 0-9.224 4.094-9.578 9.272.43 5.058 4.475 9.07 9.508 9.23h.073zM8.678 16.822c-.676-.32-1.222-.78-1.62-1.37-.508-.752-.77-1.67-.77-2.682 0-2.596 1.866-4.55 4.34-4.55.194 0 .39.012.586.036 1.556.19 2.726.96 3.392 2.234.522 1 .59 2.078.586 2.724-.004.126-.068.244-.174.32-.106.078-.242.098-.364.058-.892-.3-1.742-.384-2.454-.238-.736.148-1.316.516-1.676 1.058-.264.396-.372.844-.316 1.296.056.442.268.832.612 1.13.59.508 1.524.614 2.318.268.624-.274 1.036-.76 1.258-1.488.076-.25.122-.51.144-.774.006-.076.046-.146.108-.192.064-.046.142-.058.218-.038.7.2 1.164.612 1.38 1.222.156.442.132.912-.07 1.356-.402.888-1.288 1.61-2.428 1.976-.628.2-1.288.286-1.96.254-1.098-.052-2.1-.414-2.91-1.05-.05-.04-.098-.082-.146-.126a5.86 5.86 0 0 1-.854-.844z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.634.634 0 0 1-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.62.62 0 0 1 .194-.033c.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

interface PlatformDef {
  name: string;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
  /** true = 이미지 첨부 가능 (Web Share API 사용) */
  useImageShare?: boolean;
  /** 이미지 첨부 불가 시 URL 기반 공유 */
  getShareUrl?: (url: string, title: string) => string;
  /** 특수 처리 (카카오/인스타) */
  specialAction?: (url: string, title: string, desc: string, file: File | null) => Promise<void>;
}

function buildPlatforms(): PlatformDef[] {
  return [
    {
      name: "카카오톡",
      icon: <KakaoIcon />,
      bg: "#FEE500",
      textColor: "#3C1E1E",
      useImageShare: true,
      specialAction: async (url, title, desc, file) => {
        // 이미지 파일이 있고 Web Share API 지원하면 이미지 첨부
        if (file && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ title, text: desc + "\n" + url, files: [file] });
            return;
          } catch { /* 취소 */ }
        }
        // fallback: Web Share API (이미지 없이)
        if (navigator.share) {
          try {
            await navigator.share({ title, text: desc, url });
            return;
          } catch { /* 취소 */ }
        }
        try {
          await navigator.clipboard.writeText(url);
          alert("링크가 복사되었어요!\n카카오톡에 붙여넣기 해주세요 💬");
        } catch {
          prompt("아래 링크를 복사해주세요:", url);
        }
      },
    },
    {
      name: "인스타그램",
      icon: <InstaIcon />,
      bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
      textColor: "#fff",
      useImageShare: true,
      specialAction: async (url, title, desc, file) => {
        // 이미지 파일이 있고 Web Share API 지원하면 이미지 첨부
        if (file && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ title, text: desc + "\n" + url, files: [file] });
            return;
          } catch { /* 취소 */ }
        }
        // fallback: 이미지 다운로드 + 안내
        if (file) {
          const blobUrl = URL.createObjectURL(file);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = "너는내운멍_카드.png";
          a.click();
          URL.revokeObjectURL(blobUrl);
          alert("카드 이미지가 저장되었어요!\n인스타그램 스토리에 업로드해 보세요 📸");
          return;
        }
        try {
          await navigator.clipboard.writeText(url);
          alert("링크가 복사되었어요!\n인스타그램에 공유해 보세요 📸");
        } catch {
          prompt("아래 링크를 복사해주세요:", url);
        }
      },
    },
    {
      name: "X (트위터)",
      icon: <XIcon />,
      bg: "#000000",
      textColor: "#fff",
      useImageShare: true,
      getShareUrl: (url, title) =>
        `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
    },
    {
      name: "쓰레드",
      icon: <ThreadsIcon />,
      bg: "#000000",
      textColor: "#fff",
      useImageShare: true,
      getShareUrl: (url, title) =>
        `https://www.threads.net/intent/post?text=${enc(title + "\n" + url)}`,
    },
    {
      name: "페이스북",
      icon: <FacebookIcon />,
      bg: "#1877F2",
      textColor: "#fff",
      useImageShare: true,
      getShareUrl: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      name: "라인",
      icon: <LineIcon />,
      bg: "#06C755",
      textColor: "#fff",
      useImageShare: true,
      getShareUrl: (url, title) =>
        `https://line.me/R/share?text=${enc(title + "\n" + url)}`,
    },
  ];
}

export default function SocialShare({ url, title, description, dogName, captureCard }: SocialShareProps) {
  const platforms = buildPlatforms();
  const [sharing, setSharing] = useState(false);

  const handleClick = useCallback(
    async (p: PlatformDef) => {
      setSharing(true);
      try {
        // 이미지 캡처 (이미지 공유 지원 플랫폼만)
        let file: File | null = null;
        if (p.useImageShare || p.specialAction) {
          const blob = await captureCard();
          if (blob) {
            file = new File([blob], `${dogName}_너는내운멍.png`, { type: "image/png" });
          }
        }

        if (p.specialAction) {
          await p.specialAction(url, title, description, file);
        } else if (p.getShareUrl) {
          // URL 기반 공유 + 이미지 있으면 Web Share API 시도
          if (file && navigator.canShare?.({ files: [file] })) {
            try {
              await navigator.share({ title, text: description + "\n" + url, files: [file] });
              return;
            } catch { /* 취소 → URL 공유로 fallback */ }
          }
          window.open(
            p.getShareUrl(url, title),
            "_blank",
            "noopener,noreferrer,width=600,height=500"
          );
        }
      } finally {
        setSharing(false);
      }
    },
    [url, title, description, dogName, captureCard]
  );

  return (
    <div className="mt-4">
      <p className="text-xs font-bold text-gray-400 text-center mb-3">SNS로 공유하기</p>
      <div className="grid grid-cols-3 gap-2">
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={() => handleClick(p)}
            disabled={sharing}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl hover:scale-[1.03] active:scale-[0.97] transition-transform disabled:opacity-50"
            style={{ background: p.bg }}
          >
            {p.icon}
            <span className="text-[10px] font-bold" style={{ color: p.textColor }}>
              {sharing ? "준비중..." : p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
