export default function EarnLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)] animate-pulse font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="max-w-xl w-full">
          <div className="h-10 w-64 bg-white/5 rounded-lg mb-3" />
          <div className="h-5 w-full max-w-md bg-white/5 rounded-lg" />
        </div>
        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 min-w-[280px] w-full md:w-auto h-28 flex flex-col justify-center">
          <div className="h-4 w-40 bg-white/10 rounded mb-4" />
          <div className="h-8 w-24 bg-white/10 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-[#0c0d10] border border-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-[400px] bg-[#0c0d10] border border-white/5 rounded-2xl" />
      </div>
    </div>
  );
}
