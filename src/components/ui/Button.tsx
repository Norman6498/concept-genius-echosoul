import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold-outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon,
  iconPosition = "right",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-ui font-medium rounded-full transition-all duration-280 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B10] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#D9A441] via-[#F2C86A] to-[#D9A441] bg-[length:200%_auto] text-[#050B10] font-semibold shadow-[0_4px_24px_rgba(217,164,65,0.35)] hover:shadow-[0_6px_34px_rgba(217,164,65,0.55)] hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-[#0C1B25]/75 hover:bg-[#102531] text-[#F5EBD6] border border-[#D9A441]/25 hover:border-[#D9A441]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.98]",
    "gold-outline":
      "border border-[#D9A441]/60 text-[#F2C86A] hover:bg-[#D9A441]/15 hover:border-[#D9A441] active:scale-[0.98]",
    ghost:
      "text-[#CFC5B5] hover:text-[#F5EBD6] hover:bg-[#0C1B25]/50 active:scale-[0.98]",
  }[variant];

  const combinedStyles = `${baseStyles} ${sizeStyles} ${variantStyles} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {content}
    </button>
  );
}
