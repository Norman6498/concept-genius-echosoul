import React from "react";
import { AuthenticatedHome } from "@/components/home/AuthenticatedHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanctuary | Solenne",
  description: "Your personalized Solenne sanctuary, reflecting your inner world, authentic literature, and mindful experiences.",
};

export default function AppPage() {
  return <AuthenticatedHome />;
}
