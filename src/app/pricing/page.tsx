import React from "react";
import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Pricing | Invest in a Kinder You | Solenne",
  description:
    "Solenne is free to begin, and there when you're ready to go deeper. Explore our Free plan and Solenne Premium at ₹199/month early access.",
  openGraph: {
    title: "Solenne Pricing — Choose Your Journey",
    description: "Simple. Meaningful. Transparent. Free to begin, ₹199/month for Solenne Premium.",
    images: [
      {
        url: "/pricing/hero_bg.jpg",
        width: 1200,
        height: 630,
        alt: "Solenne Pricing",
      },
    ],
  },
};

export default function Page() {
  return <PricingPage />;
}
