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

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.487-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
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
      getShareUrl: (url, title) =>
        `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
    },
    {
      name: "페이스북",
      icon: <FacebookIcon />,
      bg: "#1877F2",
      textColor: "#fff",
      getShareUrl: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      name: "텔레그램",
      icon: <TelegramIcon />,
      bg: "#26A5E4",
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
        // fallback: URL 공유
        window.open(
          `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
          "_blank",
          "noopener,noreferrer,width=600,height=500"
        );
      },
    },
    {
      name: "라인",
      icon: <LineIcon />,
      bg: "#06C755",
      textColor: "#fff",
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
