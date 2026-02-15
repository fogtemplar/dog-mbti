export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6">
      <div className="text-4xl animate-bounce-slow mb-4">🐾</div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#E879A4]"
            style={{
              animation: "pulse-slow 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
