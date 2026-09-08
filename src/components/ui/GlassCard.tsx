import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  hoverable = false,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl p-5 ${
        hoverable ? "glass-panel-hover" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
