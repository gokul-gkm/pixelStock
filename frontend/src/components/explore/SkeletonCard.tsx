export function SkeletonCard({ h }: { h: number }) {
  return (
    <div
      className="rounded-2xl"
      style={{
        height: h,
        background: "linear-gradient(90deg,rgba(124,92,252,0.07),rgba(192,132,252,0.07),rgba(124,92,252,0.07))",
        backgroundSize: "200%",
        animation: "shimmer 1.8s ease-in-out infinite",
      }}
    />
  );
}
