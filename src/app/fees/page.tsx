import { FileText } from 'lucide-react';
export default function PlaceholderPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center min-h-[calc(100vh-80px)]">
      <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><FileText className="w-8 h-8" /></div>
      <h1 className="text-4xl font-black mb-4">Coming Soon</h1>
      <p className="text-zinc-500">This page is currently under construction.</p>
    </div>
  );
}
