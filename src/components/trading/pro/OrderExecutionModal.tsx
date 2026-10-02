import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

export type OrderStage = 'idle' | 'signing' | 'matching' | 'submitting' | 'settled' | 'failed';

interface OrderExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: OrderStage;
  txHash?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export function OrderExecutionModal({ isOpen, onClose, stage, txHash, errorMessage, onRetry }: OrderExecutionModalProps) {
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'matching' || stage === 'submitting') {
      timer = setTimeout(() => {
        setTimeoutWarning(true);
      }, 15000); // 15 seconds timeout warning
    } else {
      setTimeoutWarning(false);
    }
    return () => clearTimeout(timer);
  }, [stage]);

  if (!isOpen) return null;

  const steps = [
    { id: 'signing', label: 'Awaiting Signature', desc: 'Sign EIP-712 intent in your wallet' },
    { id: 'matching', label: 'NADO Matching', desc: 'Broadcasted to solver auction' },
    { id: 'submitting', label: 'On-Chain Submission', desc: 'Settling via Ink Network L2' },
    { id: 'settled', label: 'Execution Finalized', desc: 'Cryptographically verified' },
  ];

  const getStepStatus = (stepId: string) => {
    if (stage === 'failed') return stepId === 'signing' ? 'error' : 'pending';
    const currentIndex = steps.findIndex(s => s.id === stage);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stage === 'settled') return 'complete';
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(177,250,65,0.1)] relative">
        {(stage === 'settled' || stage === 'failed') && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6">
          <h2 className="text-xl font-black text-white tracking-tight mb-6">Order Execution</h2>
          
          <div className="space-y-6">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.id);
              
              return (
                <div key={step.id} className="flex items-start gap-4 relative">
                  {idx !== steps.length - 1 && (
                    <div className={`absolute top-8 left-3.5 w-0.5 h-10 ${status === 'complete' ? 'bg-[#B1FA41]' : 'bg-white/10'}`} />
                  )}
                  
                  <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    status === 'complete' ? 'bg-[#B1FA41] border-[#B1FA41] text-black' :
                    status === 'active' ? 'bg-transparent border-[#B1FA41] text-[#B1FA41]' :
                    status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                    'bg-transparent border-white/20 text-zinc-600'
                  }`}>
                    {status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> :
                     status === 'error' ? <AlertCircle className="w-4 h-4" /> :
                     status === 'active' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                     <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <h3 className={`text-sm font-bold ${status === 'active' || status === 'complete' ? 'text-white' : status === 'error' ? 'text-red-500' : 'text-zinc-500'}`}>
                      {step.label}
                    </h3>
                    <p className={`text-xs mt-1 ${status === 'active' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {step.desc}
                    </p>
                    
                    {status === 'error' && stage === 'failed' && errorMessage && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-400 font-mono break-words">{errorMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {timeoutWarning && (stage === 'matching' || stage === 'submitting') && (
            <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400">
                Network is experiencing high latency. Your order is still processing, but taking longer than usual. You can safely close this window—your intent is queued.
              </p>
            </div>
          )}

          {stage === 'settled' && txHash && (
            <a 
              href={`https://explorer.inkonchain.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              View on Ink Explorer <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {stage === 'failed' && onRetry && (
            <button 
              onClick={onRetry}
              className="mt-6 w-full bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] text-sm"
            >
              Retry Execution
            </button>
          )}
          
          {(stage === 'settled' || stage === 'failed') && !onRetry && (
            <button 
              onClick={onClose}
              className="mt-6 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              Dismiss
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
