"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105 active:scale-[0.98]",
      secondary:
        "bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/10 backdrop-blur-md active:scale-[0.98]",
      outline:
        "border border-amber-400/40 text-amber-200 hover:bg-amber-400/10 active:scale-[0.98]",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/[0.06] active:scale-[0.98]",
      danger:
        "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3 gap-2.5",
      icon: "p-2.5 aspect-square rounded-full",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
