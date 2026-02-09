"use client";

import { useCallback } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
}

const platforms = [
  {
    name: "카카오톡",
    icon: "💬",
    color: "#FEE500",
    textColor: "#3C1E1E",
    getUrl: (url: string, title: string, desc: string) =>
      `https://sharer.kakao.com/talk/friends/picker/link?app_key=shared&url=${enc(url)}`,
    // 카카오톡은 모바일에서 Web Share API 사용, PC에서는 링크 복사
    useMobileShare: true,
  },
  {
    name: "인스타그램",
    icon: "📸",
    color: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    textColor: "#fff",
    // 인스타그램은 URL 공유 불가 → 카드 저장 안내
    isInstagram: true,
  },
  {
    name: "트위터",
    icon: "🐦",
    color: "#000000",
    textColor: "#fff",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
  },
  {
    name: "페이스북",
    icon: "📘",
    color: "#1877F2",
    textColor: "#fff",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
  },
  {
    name: "텔레그램",
    icon: "✈️",
    color: "#0088cc",
    textColor: "#fff",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
  },
  {
    name: "라인",
    icon: "💚",
    color: "#06C755",
    textColor: "#fff",
    getUrl: (url: string, title: string) =>
      `https://social-plugins.line.me/lineit/share?url=${enc(url)}&text=${enc(title)}`,
  },
] as const;

function enc(s: string) {
  return encodeURIComponent(s);
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const handleShare = useCallback(
    async (platform: (typeof platforms)[number]) => {
      // 인스타그램: 카드 이미지 저장 안내
      if ("isInstagram" in platform && platform.isInstagram) {
        alert("카드 이미지를 저장한 후\n인스타그램 스토리에 공유해 보세요! 📸");
        return;
      }

      // 모바일 Web Share API 우선 시도 (카카오톡 등)
      if ("useMobileShare" in platform && platform.useMobileShare) {
        if (navigator.share) {
          try {
            await navigator.share({ title, text: description, url });
            return;
          } catch {
            // 사용자 취소 또는 미지원 → 링크 복사 fallback
          }
        }
        // PC fallback: 링크 복사
        try {
          await navigator.clipboard.writeText(url);
          alert("링크가 복사되었어요!\n카카오톡에 붙여넣기 해주세요 💬");
        } catch {
          alert("링크 복사에 실패했어요.\n주소창에서 직접 복사해 주세요.");
        }
        return;
      }

      // 일반 플랫폼: 새 창으로 공유
      if ("getUrl" in platform && platform.getUrl) {
        const shareUrl = platform.getUrl(url, title, description);
        window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
      }
    },
    [url, title, description]
  );

  return (
    <div className="mt-4">
      <p className="text-xs font-bold text-gray-400 text-center mb-3">SNS로 공유하기</p>
      <div className="grid grid-cols-3 gap-2">
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={() => handleShare(p)}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl hover:scale-[1.03] active:scale-[0.97] transition-transform"
            style={{
              background:
                typeof p.color === "string" && p.color.startsWith("linear")
                  ? p.color
                  : p.color,
              color: p.textColor,
            }}
          >
            <span className="text-xl">{p.icon}</span>
            <span className="text-[10px] font-bold">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
