export default function MarketLoading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-black px-4 sm:px-8 py-8 animate-pulse font-sans">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="w-48 h-8 bg-white/5 rounded-lg" />
          <div className="w-64 h-4 bg-white/5 rounded-lg" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 h-24" />
          ))}
        </div>

        {/* Filters Row Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-20 h-8 bg-white/5 rounded-full" />
            ))}
          </div>
          <div className="w-48 h-8 bg-white/5 rounded-lg" />
        </div>

        {/* Table Skeleton */}
        <div className="w-full bg-[#0B0E14] border border-white/10 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-white/10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-4 bg-white/5 rounded" />
            ))}
          </div>
          {/* Rows */}
          <div className="divide-y divide-white/5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center px-6 py-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full" />
                  <div className="w-20 h-4 bg-white/5 rounded" />
                </div>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex-1 h-4 bg-white/5 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
