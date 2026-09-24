'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAccount, useBlockNumber } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  const { data: blockNumber, isError, isLoading } = useBlockNumber({ watch: true });

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-80px)] bg-black overflow-hidden font-sans">
      
      {/* Decorative Neon Glowing Orb (from the image) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B1FA41]/20 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[800px] h-[800px] bg-[#B1FA41]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 min-h-[65vh] px-4 pt-10">
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
          Transform <span className="text-[#B1FA41]">the way</span> <br />
          you trading
        </h1>
        
        <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-xl">
          Safe and easy tools crypto trading for everyone.
        </p>

        {/* Input & Button Combo */}
        <div className="relative w-full max-w-md mt-4 p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md flex items-center shadow-2xl transition-all focus-within:border-[#B1FA41]/50">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-zinc-500 text-sm"
          />
          <Link 
            href="/trade" 
            className="group flex items-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] hover:shadow-[0_0_30px_rgba(177,250,65,0.4)] text-sm"
          >
            Trade now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Dashboard Mockup Section (Using our app's style but mocked like the image) */}
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-[#0c0c0c] rounded-t-[32px] md:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative">
          
          {/* Top Navbar mockup inside the image */}
          <div className="absolute top-0 left-0 w-full h-16 border-b border-white/5 flex items-center px-6 justify-between opacity-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#B1FA41]" />
              <div className="w-24 h-4 rounded bg-white/20" />
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
          </div>
          
          {/* Left Sidebar mockup */}
          <div className="absolute top-16 left-0 w-48 h-full border-r border-white/5 p-4 flex flex-col gap-4 opacity-30">
            <div className="w-full h-8 rounded bg-[#B1FA41]/20" />
            <div className="w-3/4 h-8 rounded bg-white/5" />
            <div className="w-5/6 h-8 rounded bg-white/5" />
            <div className="w-full h-8 rounded bg-white/5" />
          </div>

          {/* Main Content Area mockup */}
          <div className="absolute top-16 left-48 right-0 h-full p-6 flex gap-6">
            <div className="flex-[2] bg-white/5 rounded-2xl border border-white/5 p-6 opacity-60">
              <div className="w-32 h-4 bg-white/20 rounded mb-4" />
              <div className="w-48 h-10 bg-white/40 rounded mb-8" />
              <div className="w-full h-32 bg-gradient-to-t from-[#B1FA41]/20 to-transparent rounded" />
            </div>
            <div className="flex-[1] bg-white/5 rounded-2xl border border-white/5 p-6 opacity-60">
              <div className="w-16 h-4 bg-white/20 rounded mb-4" />
              <div className="w-full h-12 bg-white/10 rounded mb-4" />
              <div className="w-full h-12 bg-white/10 rounded" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
