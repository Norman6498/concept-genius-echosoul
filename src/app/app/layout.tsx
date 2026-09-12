import React from "react";
import { AppRouteGuard } from "@/lib/auth/guard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppRouteGuard>{children}</AppRouteGuard>;
}
