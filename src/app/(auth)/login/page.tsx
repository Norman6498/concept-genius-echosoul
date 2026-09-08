"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, ArrowRight, Mail, Lock, HeartHandshake } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (isMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Magic link sent! Please check your inbox." });
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Account created! You can now sign in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/app");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Authentication failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = () => {
    signInAsGuest();
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500/10 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Brand Header (Screen 1 Reference) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500/30 to-indigo-500/30 border border-amber-400/40 shadow-xl shadow-amber-500/10 mb-2">
            <Sparkles className="h-6 w-6 text-amber-300" />
          </div>
          <h1 className="text-3xl font-serif-display font-medium tracking-wide text-slate-100">
            EchoSoul
          </h1>
          <p className="text-xs text-amber-200/80 font-serif-display italic tracking-wide">
            &ldquo;A place for all that you feel&rdquo;
          </p>
        </div>

        {/* Auth Card */}
        <GlassCard className="p-6 md:p-8 space-y-6 border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <button
              onClick={() => {
                setIsSignUp(false);
                setIsMagicLink(false);
                setMessage(null);
              }}
              className={`text-xs font-medium pb-2 border-b-2 -mb-3 transition-colors cursor-pointer ${
                !isSignUp && !isMagicLink
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setIsMagicLink(false);
                setMessage(null);
              }}
              className={`text-xs font-medium pb-2 border-b-2 -mb-3 transition-colors cursor-pointer ${
                isSignUp
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setIsMagicLink(true);
                setIsSignUp(false);
                setMessage(null);
              }}
              className={`text-xs font-medium pb-2 border-b-2 -mb-3 transition-colors cursor-pointer ${
                isMagicLink
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Magic Link
            </button>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs ${
                message.type === "error"
                  ? "bg-red-500/15 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {!isMagicLink && (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading
                ? "Connecting..."
                : isMagicLink
                ? "Send Magic Link"
                : isSignUp
                ? "Join EchoSoul"
                : "Enter Sanctuary"}
            </Button>
          </form>

          {/* Guest Demo Mode Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0e1422] px-3 text-[11px] text-slate-400 uppercase tracking-widest absolute">
              or
            </span>
          </div>

          {/* Continue as Guest (Demo Mode) */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleGuestDemo}
            className="w-full gap-2 text-amber-200 border-amber-500/20 hover:bg-amber-500/10"
          >
            <HeartHandshake className="h-4 w-4 text-amber-300" />
            <span>Continue as Guest (Demo Mode)</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Button>
        </GlassCard>

        <p className="text-center text-[11px] text-slate-400 font-light max-w-xs mx-auto">
          Guest mode provides immediate access to preview all areas and features. No data is stored externally until you sign in.
        </p>
      </div>
    </div>
  );
}
