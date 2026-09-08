"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=signup");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
      <div className="h-10 w-10 rounded-full bg-amber-400/20 animate-pulse" />
    </div>
  );
}
