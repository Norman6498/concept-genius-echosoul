import React from "react";

interface PaperCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function PaperCard({ children, className = "", ...props }: PaperCardProps) {
  return (
    <div
      className={`paper-canvas rounded-xl p-6 md:p-8 ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
