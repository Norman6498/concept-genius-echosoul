import React from "react";
import { OnboardingRouteGuard } from "@/lib/auth/guard";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingRouteGuard>{children}</OnboardingRouteGuard>;
}
