'use client';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-sans">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-md">
        {error.message || 'Failed to load protocol data. Please check your network connection.'}
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] px-4 py-2 font-medium text-black transition"
      >
        Try Again
      </button>
    </div>
  );
}
