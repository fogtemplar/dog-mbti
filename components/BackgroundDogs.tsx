"use client";

/**
 * 9종 강아지 얼굴 스티커를 배경에 은은하게 배치하는 장식 컴포넌트.
 * public/dogs/ 폴더의 실제 이미지 사용.
 * position: fixed + pointer-events: none → 콘텐츠 뒤 월페이퍼.
 */

interface DogPos {
  src: string;
  x: string;
  y: string;
  size: number;
  rotate: number;
  opacity: number;
}

const dogPositions: DogPos[] = [
  { src: "/dogs/maltese.webp",     x: "-2%",  y: "2%",   size: 120, rotate: -15,  opacity: 0.18 },
  { src: "/dogs/poodle.webp",      x: "75%",  y: "5%",   size: 105, rotate: 20,   opacity: 0.16 },
  { src: "/dogs/jackrussell.webp", x: "8%",   y: "20%",  size: 100, rotate: 10,   opacity: 0.17 },
  { src: "/dogs/pomeranian.webp",  x: "85%",  y: "28%",  size: 95,  rotate: -18,  opacity: 0.15 },
  { src: "/dogs/shiba.webp",       x: "-3%",  y: "44%",  size: 115, rotate: 12,   opacity: 0.17 },
  { src: "/dogs/yorkie.webp",      x: "72%",  y: "55%",  size: 100, rotate: -10,  opacity: 0.16 },
  { src: "/dogs/golden.webp",      x: "5%",   y: "66%",  size: 120, rotate: 25,   opacity: 0.19 },
  { src: "/dogs/jindo.webp",       x: "78%",  y: "75%",  size: 110, rotate: -20,  opacity: 0.17 },
  { src: "/dogs/bichon.webp",      x: "35%",  y: "88%",  size: 100, rotate: 8,    opacity: 0.15 },
];

export default function BackgroundDogs() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {dogPositions.map((dog, i) => (
        <img
          key={i}
          src={dog.src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: dog.x,
            top: dog.y,
            width: dog.size,
            height: dog.size,
            objectFit: "contain",
            opacity: dog.opacity,
            transform: `rotate(${dog.rotate}deg)`,
            userSelect: "none",
          }}
        />
      ))}
    </div>
  );
}
