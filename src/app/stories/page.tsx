import React from "react";
import type { Metadata } from "next";
import { StoriesPage } from "@/components/stories/StoriesPage";

export const metadata: Metadata = {
  title: "Stories of What's Possible | Solenne",
  description:
    "Real people. Real journeys. Moments of struggle can be the beginning of something beautiful. Explore authentic stories of clarity, healing, creativity, and companionship with Solenne.",
  openGraph: {
    title: "Stories of What's Possible | Solenne",
    description:
      "Moments of struggle can be the beginning of something beautiful. Explore authentic stories of clarity, healing, creativity, and companionship.",
    images: [
      {
        url: "/stories/hero_bg.jpg",
        width: 1200,
        height: 630,
        alt: "Solenne Stories",
      },
    ],
  },
};

export default function Page() {
  return <StoriesPage />;
}
