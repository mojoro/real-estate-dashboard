export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-900 rounded-xl border border-gray-800" />
        ))}
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-900 rounded-xl border border-gray-800" />
        ))}
      </div>
      {/* Table skeleton */}
      <div className="h-96 bg-gray-900 rounded-xl border border-gray-800" />
    </div>
  );
}
