import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold-outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B10] disabled:opacity-45 disabled:pointer-events-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-[10px] gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-[12px] gap-2",
    lg: "text-base px-7 py-3.5 rounded-[14px] gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#F2C86A] via-[#D9A441] to-[#C48E2E] text-[#050B10] font-semibold shadow-[0_4px_20px_rgba(217,164,65,0.28)] hover:shadow-[0_6px_28px_rgba(217,164,65,0.42)] hover:brightness-105 border border-[#F7D57B]/40",
    secondary:
      "bg-[#0C1B25]/80 hover:bg-[#102531] text-[#F5EBD6] border border-[#D9A441]/25 hover:border-[#D9A441]/50 shadow-sm backdrop-blur-md",
    "gold-outline":
      "bg-transparent hover:bg-[#D9A441]/10 text-[#F2C86A] border border-[#D9A441]/40 hover:border-[#D9A441]/70",
    ghost:
      "bg-transparent hover:bg-[#102531]/60 text-[#CFC5B5] hover:text-[#F5EBD6]",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
        {icon && <span className="shrink-0">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
