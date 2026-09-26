'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-white">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <button onClick={() => reset()} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
        Try again
      </button>
    </div>
  );
}
