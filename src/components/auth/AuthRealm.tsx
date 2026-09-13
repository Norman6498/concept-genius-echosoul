"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconSet } from "@/components/ui/IconSet";
import { CinematicBackground, AmbientParticles, LampGlow } from "@/components/visual";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";

interface AuthRealmProps {
  initialMode?: "signup" | "login" | "otp";
}

const CAROUSEL_SLIDES = [
  {
    quote: "Not just an AI. A companion for your becoming.",
    author: "Solenne Sanctuary",
  },
  {
    quote: "Where your feelings aren't problems to fix, but stories to honor.",
    author: "Quiet Reflection",
  },
  {
    quote: "Real literature, music, and quiet wisdom when you need it most.",
    author: "Timeless Words",
  },
  {
    quote: "Your memories, your growth, held safely without judgment.",
    author: "The Journey",
  },
];

export function AuthRealm({ initialMode = "signup" }: AuthRealmProps) {
  const router = useRouter();
  const { user, authStatus, onboardingCompleted, isLoading: authLoading, resolvePostAuthRoute, refreshAuth, signInAsGuest } = useAuth();

  const [mode, setMode] = useState<"signup" | "login" | "otp">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // If already authenticated or in Guest mode, redirect straight to /app
  useEffect(() => {
    if (!authLoading && (authStatus === "AUTHENTICATED" || authStatus === "GUEST")) {
      if (authStatus === "GUEST") {
        router.replace("/app");
      } else if (user) {
        if (onboardingCompleted === true) {
          router.replace("/app");
        } else if (onboardingCompleted === false) {
          router.replace(resolvePostAuthRoute());
        }
      }
    }
  }, [authLoading, authStatus, onboardingCompleted, resolvePostAuthRoute, router, user]);

  const resolveTargetRoute = useCallback(async (supabase: any, userId: string, accessToken?: string): Promise<string> => {
    try {
      // 1. Direct database profile lookup
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("onboarding_completed, onboarding_step")
        .eq("id", userId)
        .maybeSingle();

      if (userProfile?.onboarding_completed === true) {
        return "/app";
      }

      // 2. Authoritative server verification with token
      try {
        const res = await fetch("/api/auth/onboarding-status", {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        if (res.ok) {
          const status = await res.json();
          if (status.onboardingCompleted === true) {
            return "/app";
          }
          if (status.onboardingStep && status.onboardingStep > 1) {
            switch (status.onboardingStep) {
              case 2: return "/onboarding/interests";
              case 3: return "/onboarding/world";
              case 4: return "/onboarding/preferences";
              case 5: return "/onboarding/appearance";
              case 6: return "/onboarding/complete";
            }
          }
        }
      } catch {
        // API fallback
      }

      if (userProfile?.onboarding_step && userProfile.onboarding_step > 1) {
        switch (userProfile.onboarding_step) {
          case 2: return "/onboarding/interests";
          case 3: return "/onboarding/world";
          case 4: return "/onboarding/preferences";
          case 5: return "/onboarding/appearance";
          case 6: return "/onboarding/complete";
        }
      }
    } catch {
      // Fallback
    }
    return "/onboarding";
  }, []);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  // 1. Send OTP Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          data: {
            display_name: name.trim() || undefined,
          },
        },
      });

      if (error) {
        // Provide friendly message if SMTP is rate limited or unconfigured on project
        if (error.message.toLowerCase().includes("rate limit") || error.message.includes("SMTP")) {
          setMessage({
            type: "info",
            text: "Notice: Supabase default email verification rate limit reached for this hour on free tier. Please use Password Login mode above, or continue directly.",
          });
        } else {
          setMessage({ type: "error", text: error.message });
        }
      } else {
        setOtpSent(true);
        setMessage({
          type: "success",
          text: `Verification code sent to ${email}. Check your inbox or spam folder.`,
        });
        // Start countdown
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otpCode) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: "email",
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else if (data.session) {
        const targetRoute = await resolveTargetRoute(supabase, data.session.user.id, data.session.access_token);
        setMessage({
          type: "success",
          text: targetRoute === "/app"
            ? "Welcome back! Entering your sanctuary..."
            : "Verification successful! Entering your realm...",
        });
        await refreshAuth();
        setTimeout(() => {
          window.location.href = targetRoute;
        }, 500);
      }
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Password Sign Up & Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim() || undefined,
            },
          },
        });

        if (error) {
          const isRateLimit = error.message.toLowerCase().includes("rate limit") ||
                              error.message.toLowerCase().includes("email") ||
                              error.message.includes("SMTP");
          if (isRateLimit) {
            setMessage({
              type: "info",
              text: "Supabase email rate limits are currently reached on free tier. If your account already exists, please switch to Sign In above, or continue directly as a Guest Explorer.",
            });
          } else {
            setMessage({ type: "error", text: error.message });
          }
        } else if (data.session) {
          // Direct session created for brand-new account
          setMessage({
            type: "success",
            text: `Welcome to Solenne, ${name || "friend"}! Entering Step 1...`,
          });
          await refreshAuth();
          setTimeout(() => {
            window.location.href = "/onboarding";
          }, 600);
        } else if (data.user && !data.session) {
          // Email confirmation is required by provider
          setMessage({
            type: "info",
            text: `Verification email sent to ${email}. If not received immediately due to hourly email quotas, you can sign in directly or continue as Guest Explorer.`,
          });
        }
      } else if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else if (data.session) {
          // Authoritative check on whether user previously completed onboarding
          const targetRoute = await resolveTargetRoute(supabase, data.session.user.id, data.session.access_token);
          setMessage({
            type: "success",
            text: targetRoute === "/app"
              ? "Welcome back! Opening your personalized sanctuary..."
              : "Welcome back. Opening your personalized space...",
          });
          await refreshAuth();
          setTimeout(() => {
            window.location.href = targetRoute;
          }, 500);
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestExplorer = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isGuestLoading || isLoading) return;

    setIsGuestLoading(true);
    setMessage(null);

    try {
      const res = await signInAsGuest();
      if (res.success) {
        setMessage({
          type: "success",
          text: "Welcome to Solenne. Opening Guest Explorer...",
        });
        await refreshAuth();
        setTimeout(() => {
          router.replace("/app");
        }, 400);
      } else {
        setMessage({
          type: "error",
          text: res.error || "We couldn't open Explorer Mode right now. Please try again.",
        });
        setIsGuestLoading(false);
      }
    } catch (err: any) {
      console.error("[GuestAuth] Entry error:", err);
      setMessage({
        type: "error",
        text: "We couldn't open Explorer Mode right now. Please try again.",
      });
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] overflow-x-hidden select-none flex flex-col justify-between">
      {/* ── Background Visual Artwork with Next.js LCP Priority & Responsive Focal Point ──────── */}
      <CinematicBackground
        src="/page2-clean.png"
        alt="Solenne Auth Sanctuary Atmosphere"
        priority
        focalPoint={{ desktop: "25% center", mobile: "20% center" }}
        overlay="sanctuary"
      >
        <AmbientParticles count={16} type="stars" palette="gold" />
        <LampGlow
          position={{ bottom: "28%", left: "11%" }}
          size={220}
          color="rgba(255, 184, 107, 0.25)"
        />
      </CinematicBackground>

      {/* ── Header Layer ─────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <BrandLogo size="md" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-ui text-xs sm:text-sm text-[#CFC5B5] hover:text-[#F2D78A] transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2D78A] rounded"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline font-ui text-sm text-[#CFC5B5]">
            {mode === "signup" ? "Already have an account?" : "Need an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setMessage(null);
              setOtpSent(false);
            }}
            className="font-ui text-xs sm:text-sm font-medium text-[#FFF8E1] hover:text-[#F2D78A] border border-white/30 hover:border-[#F2D78A]/80 rounded-full px-5 sm:px-6 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] shadow-sm hover:shadow-[0_0_15px_rgba(242,215,138,0.2)]"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 py-6 sm:py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT: Typography & Carousel */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8 pr-0 lg:pr-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08131B]/80 border border-[#F2D78A]/30 mb-4 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2D78A] animate-pulse" />
                <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#F2D78A] font-medium">
                  Solenne Sanctuary
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#FFF8E1] font-normal leading-[1.1] tracking-tight">
                A quieter mind.<br />
                <span className="italic text-[#F2D78A]">A deeper</span><br />
                tomorrow.
              </h1>

              <p className="mt-5 font-ui text-sm sm:text-base lg:text-[17px] text-[#CFC5B5] font-light leading-relaxed max-w-[480px]">
                Join Solenne, and take the first step towards understanding, healing, and becoming the story you&apos;re proud of.
              </p>
            </div>

            <div className="relative pl-5 border-l-2 border-[#F2D78A]/40 max-w-[460px] py-1">
              <p className="font-display italic text-lg sm:text-xl text-[#FFF8E1] leading-snug">
                &ldquo;A journey of a thousand miles begins with a single conversation.&rdquo;
              </p>
              <p className="font-ui text-xs sm:text-sm text-[#F2D78A] font-medium mt-2">
                — Lao Tzu
              </p>
            </div>

            <div className="pt-4 sm:pt-8 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {CAROUSEL_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`transition-all duration-300 rounded-full ${
                        currentSlide === i
                          ? "w-2.5 h-2.5 bg-[#F2D78A] shadow-[0_0_8px_#F2D78A]"
                          : "w-2 h-2 border border-[#9AA8B0]/50 hover:border-[#FFF8E1]"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-8 h-8 rounded-full border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] flex items-center justify-center transition-colors focus:outline-none"
                  >
                    <span className="text-sm">←</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-8 h-8 rounded-full border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] flex items-center justify-center transition-colors focus:outline-none"
                  >
                    <span className="text-sm">→</span>
                  </button>
                </div>

                <span className="font-ui text-xs text-[#9AA8B0] font-mono tracking-wider">
                  {currentSlide + 1} / {CAROUSEL_SLIDES.length}
                </span>
              </div>

              <div className="min-h-[36px]">
                <p className="font-display italic text-sm sm:text-base text-[#F2D78A]/90 es-fade-up">
                  &ldquo;{CAROUSEL_SLIDES[currentSlide].quote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* CENTER-RIGHT: Floating Auth Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px] rounded-[24px] p-7 sm:p-9 bg-[#0C1B25]/98 backdrop-blur-2xl border border-[#F2D78A]/30 shadow-[0_24px_64px_rgba(0,0,0,0.95),0_0_30px_rgba(242,215,138,0.15)] transition-all">

              {/* Crest */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="relative w-12 h-12 flex items-center justify-center mb-2.5">
                  <div className="absolute inset-0 rounded-full bg-[#F2D78A]/20 blur-xl es-moon-glow" />
                  <BrandLogo size="md" showText={false} />
                </div>

                <span className="font-ui text-xs uppercase tracking-[0.24em] text-[#CFC5B5] font-medium">
                  {mode === "otp" ? "Email Verification" : mode === "signup" ? "Welcome to" : "Welcome back to"}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#FFF8E1] font-normal tracking-tight mt-1">
                  Solenne
                </h2>
                <p className="font-ui text-xs sm:text-[13px] text-[#9AA8B0] mt-1.5">
                  {mode === "otp"
                    ? "Verify with a secure 6-digit one-time passcode."
                    : mode === "signup"
                    ? "Create your account and enter your realm."
                    : "Enter your credentials to return to your sanctuary."}
                </p>
              </div>

              {/* Mode Toggle Pills (Password vs 6-Digit OTP) */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#08131B]/80 border border-white/10 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "otp" ? "signup" : mode);
                    setMessage(null);
                  }}
                  className={`py-1.5 text-xs font-ui font-medium rounded-lg transition-all ${
                    mode !== "otp"
                      ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-sm"
                      : "text-[#9AA8B0] hover:text-[#FFF8E1]"
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("otp");
                    setMessage(null);
                  }}
                  className={`py-1.5 text-xs font-ui font-medium rounded-lg transition-all ${
                    mode === "otp"
                      ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-sm"
                      : "text-[#9AA8B0] hover:text-[#FFF8E1]"
                  }`}
                >
                  6-Digit Email OTP
                </button>
              </div>

              {/* Notification Banner */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-xs font-ui leading-relaxed ${
                  message.type === "success"
                    ? "bg-[#8DBA8F]/15 border border-[#8DBA8F]/40 text-[#8DBA8F]"
                    : message.type === "info"
                    ? "bg-[#F2D78A]/15 border border-[#F2D78A]/40 text-[#F2D78A]"
                    : "bg-[#D97777]/15 border border-[#D97777]/40 text-[#D97777]"
                }`}>
                  {message.text}
                </div>
              )}

              {/* ── MODE A: 6-DIGIT EMAIL OTP ── */}
              {mode === "otp" ? (
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full h-11 px-3.5 input-field-dark text-xs sm:text-sm font-ui"
                      />
                    </div>

                    <div>
                      <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-11 px-3.5 input-field-dark text-xs sm:text-sm font-ui"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Sending Code..." : "Send 6-Digit OTP Code →"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-ui text-xs text-[#CFC5B5]">
                          Enter 6-Digit Code
                        </label>
                        <span className="font-ui text-[11px] text-[#F2D78A]">
                          Sent to {email}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full h-12 text-center tracking-[0.5em] text-lg font-mono input-field-dark font-bold text-[#F2D78A]"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-ui text-[#9AA8B0]">
                      <span>Didn&apos;t receive code?</span>
                      <button
                        type="button"
                        disabled={countdown > 0 || isLoading}
                        onClick={handleSendOtp}
                        className="text-[#F2D78A] hover:underline disabled:opacity-50"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length < 6}
                      className="w-full h-12 rounded-xl btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Verifying..." : "Verify & Enter Solenne →"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs font-ui text-[#9AA8B0] hover:text-[#FFF8E1]"
                    >
                      ← Change Email Address
                    </button>
                  </form>
                )
              ) : (
                /* ── MODE B: EMAIL & PASSWORD (SIGN UP / LOGIN) ── */
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full h-11 px-3.5 input-field-dark text-xs sm:text-sm font-ui"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 px-3.5 input-field-dark text-xs sm:text-sm font-ui"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-ui text-xs text-[#CFC5B5]">
                        Password
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setMode("otp")}
                          className="font-ui text-[11px] text-[#F2D78A] hover:underline"
                        >
                          Use OTP code instead?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 pl-3.5 pr-10 input-field-dark text-xs sm:text-sm font-ui"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9AA8B0] hover:text-[#FFF8E1]"
                      >
                        <IconSet name={showPassword ? "eye" : "eye-off"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isLoading
                      ? "Entering..."
                      : mode === "signup"
                      ? "Create Account & Enter →"
                      : "Sign In & Return →"}
                  </button>
                </form>
              )}

              {/* Guest / Direct Explorer button */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={handleGuestExplorer}
                  disabled={isGuestLoading || isLoading}
                  className="font-ui text-xs text-[#9AA8B0] hover:text-[#F2D78A] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGuestLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F2D78A] border-t-transparent animate-spin" />
                      <span>Entering Explorer Mode…</span>
                    </>
                  ) : (
                    <span>Continue directly as Guest Explorer →</span>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Footer Layer ─────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between border-t border-white/5 font-ui text-[11px] text-[#9AA8B0]">
        <span>© 2026 Solenne. All rights reserved.</span>
        <span>A Concept Genius Project</span>
      </footer>
    </div>
  );
}
