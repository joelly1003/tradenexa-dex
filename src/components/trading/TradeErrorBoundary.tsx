'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TradeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TradeErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#0B0E14] border border-amber-500/20 rounded-2xl text-center min-h-[220px] font-sans h-full w-full">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            {this.props.fallbackTitle || 'Trading Module Interrupted'}
          </h3>

          <p className="text-xs text-zinc-400 max-w-xs mb-4 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred in this panel. Real-time feeds will resume once reset.'}
          </p>

          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(177,250,65,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Trade Form</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
