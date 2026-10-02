import React, { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { WalletConnectButton } from '../WalletConnectButton';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  pathname: string;
}

export function MobileNav({ isOpen, onClose, navLinks, pathname }: MobileNavProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-[#08080a] border-l border-white/10 z-[101] shadow-2xl flex flex-col lg:hidden animate-in slide-in-from-right duration-200 font-sans">
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="text-xl font-black tracking-tight text-white flex items-baseline leading-none">
            Trade<span className="text-[#B1FA41]">Nexa</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={onClose}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive 
                    ? 'bg-[#B1FA41]/10 text-[#B1FA41]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 pb-8 flex flex-col gap-4">
          <WalletConnectButton />
        </div>
      </div>
    </>
  );
}
