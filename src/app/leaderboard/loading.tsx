export default function LeaderboardLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)] font-sans animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="w-full max-w-xl">
          <div className="w-40 h-6 bg-white/5 rounded-full mb-3" />
          <div className="w-64 h-10 bg-white/5 rounded-lg mb-2" />
          <div className="w-full h-4 bg-white/5 rounded" />
        </div>
        <div className="w-48 h-10 bg-white/5 rounded-xl" />
      </div>

      <div className="bg-[#0B0E14] border border-white/10 rounded-3xl overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-12 gap-4 items-center py-4 px-6 border-b border-white/10 bg-[#0e1118]">
          <div className="col-span-1 h-4 bg-white/5 rounded" />
          <div className="col-span-3 sm:col-span-4 h-4 bg-white/5 rounded" />
          <div className="col-span-4 sm:col-span-3 h-4 bg-white/5 rounded" />
          <div className="hidden sm:block sm:col-span-2 h-4 bg-white/5 rounded" />
          <div className="col-span-4 sm:col-span-2 h-4 bg-white/5 rounded" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 px-6 hover:bg-white/[0.02]">
              <div className="col-span-1 h-5 w-5 bg-white/10 rounded" />
              <div className="col-span-3 sm:col-span-4 h-4 bg-white/5 rounded w-32" />
              <div className="col-span-4 sm:col-span-3 h-4 bg-white/5 rounded w-24" />
              <div className="hidden sm:block sm:col-span-2 h-4 bg-white/5 rounded w-20" />
              <div className="col-span-4 sm:col-span-2 h-4 bg-white/5 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
