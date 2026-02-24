export function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="rounded-3xl overflow-hidden animate-pulse"
      style={{
        height,
        background: "linear-gradient(90deg,rgba(124,92,252,0.07),rgba(192,132,252,0.07),rgba(124,92,252,0.07))",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
