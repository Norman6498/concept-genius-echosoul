"use client";

import React from "react";
import { Button } from "./Button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl glass-panel max-w-md mx-auto my-6">
      <div className="h-12 w-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-300/70 mb-4">
        {icon || <div className="h-4 w-4 rounded-full bg-amber-400/40 animate-pulse" />}
      </div>
      <h3 className="text-lg font-serif-display font-medium text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Listening quietly..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500/20 to-indigo-500/30 border border-amber-400/30 animate-breathe" />
      <p className="text-xs font-serif-display tracking-widest text-slate-400 uppercase">
        {label}
      </p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something held us back for a moment.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl glass-panel border-red-500/20 max-w-md mx-auto my-6">
      <AlertCircle className="h-8 w-8 text-red-400/80 mb-3" />
      <h4 className="text-base font-medium text-slate-200 mb-1">A quiet hesitation</h4>
      <p className="text-sm text-slate-400 mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Try again gently
        </Button>
      )}
    </div>
  );
}
