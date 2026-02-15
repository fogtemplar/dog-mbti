import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "너는내운멍 - 강아지 성향 테스트",
    short_name: "너는내운멍",
    description: "사진 업로드와 보호자 관찰 질문으로 알아보는 강아지 MBTI 성향 테스트",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF5F9",
    theme_color: "#E879A4",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
