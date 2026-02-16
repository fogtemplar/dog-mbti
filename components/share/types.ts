export interface ShareCardProps {
  dogName: string;
  nickname: string;
  code: string;
  emoji: string;
  summary: string;
  bgColor: string;
  photoUrl: string | null;
  percentages: {
    axis: string;
    left: { label: string; pct: number };
    right: { label: string; pct: number };
  }[];
  breedName?: string;
  ownerName?: string;
  ownerMbti?: string;
}

export interface CardInnerProps {
  dogName: string;
  nickname: string;
  code: string;
  emoji: string;
  summary: string;
  photoUrl: string | null;
  percentages: ShareCardProps["percentages"];
  breedName?: string;
  ownerName?: string;
  ownerMbti?: string;
  colors: { bg: string; accent: string };
}
