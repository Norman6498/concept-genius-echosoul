"use client";

import React, { useState, useRef, useEffect } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mic,
  MessageSquare,
  Upload,
  Lightbulb,
  Bookmark,
  BookOpen,
  Compass,
  Map,
  Send,
  Trash2,
  Volume2,
  ArrowUpRight,
  X,
  Sparkles,
} from "lucide-react";
import { getLiteratureTypography } from "@/lib/typography";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem, removeScopedStorageItem } from "@/lib/auth/sessionBoundary";
import {
  setConversationAnchor,
  parseVoiceExperienceCommand,
  pushExperience,
  ExperienceType,
} from "@/lib/orchestration/experienceStack";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
}

export default function TalkPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"text" | "voice" | "upload">("voice");
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [writtenText, setWrittenText] = useState("");
  const [targetAnswer, setTargetAnswer] = useState("");
  const [pendingExperience, setPendingExperience] = useState<{
    type: ExperienceType;
    title: string;
    path: string;
    reason: string;
  } | null>(null);

  const userIdRef = useRef<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>("");
  const silenceTimerRef = useRef<any>(null);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  const speakVoiceReply = (textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || isVoiceMuted) return;
    try {
      window.speechSynthesis.cancel();
      const cleanSpoken = textToSpeak
        .replace(/[*_#>`]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      if (!cleanSpoken) return;
      const utterance = new SpeechSynthesisUtterance(cleanSpoken);

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Female"))) ||
        voices.find((v) => v.lang.startsWith("en"));
      const naturalVoice = voices.find(
        (v) => (v.lang.startsWith("en") || v.lang.startsWith("hi")) && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
      );
      if (naturalVoice) utterance.voice = naturalVoice;
      else if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Restore chat messages strictly scoped to current user
  useEffect(() => {
    let isMounted = true;
    async function loadTalkHistory() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;

        userIdRef.current = user?.id || null;

        const saved = getScopedStorageItem<ChatMessage[]>(user?.id, "talk_messages", []);
        if (Array.isArray(saved) && saved.length > 0) {
          setMessages(saved);
        } else {
          setMessages([]);
        }
      } catch {}
    }
    loadTalkHistory();
    return () => { isMounted = false; };
  }, []);

  // Persist messages whenever messages array updates
  const saveMessagesToStorage = (updated: ChatMessage[]) => {
    setScopedStorageItem(userIdRef.current, "talk_messages", updated);
  };

  // Letter-by-letter ink inscription effect
  useEffect(() => {
    if (!isWriting || !targetAnswer) return;
    let idx = 0;
    setWrittenText("");
    const timer = setInterval(() => {
      idx++;
      setWrittenText(targetAnswer.slice(0, idx));
      if (idx >= targetAnswer.length) {
        clearInterval(timer);
        setIsWriting(false);
        setMessages((prev) => {
          const updated: ChatMessage[] = [...prev, { role: "assistant", text: targetAnswer, timestamp: Date.now() }];
          saveMessagesToStorage(updated);
          return updated;
        });
      }
    }, 24);
    return () => clearInterval(timer);
  }, [isWriting, targetAnswer]);

  const handleSend = async (msgToSend?: string) => {
    const text = (msgToSend || inputText || speechTranscript).trim();
    if (!text || isLoading || isWriting) return;

    // Instant interruption / barge-in: cancel any currently speaking audio
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    // Stop recognition if active
    if (isListening) {
      stopListening();
    }

    setInputText("");
    setSpeechTranscript("");
    accumulatedTranscriptRef.current = "";

    const updatedUserMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text, timestamp: Date.now() },
    ];
    setMessages(updatedUserMessages);
    saveMessagesToStorage(updatedUserMessages);
    setIsLoading(true);

    // Retrieve or generate valid UUID session ID strictly scoped to user
    let currentSessionId = "";
    try {
      currentSessionId = getScopedStorageItem<string>(userIdRef.current, "active_session_id", "") || "";
      if (!currentSessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(currentSessionId)) {
        currentSessionId = crypto.randomUUID();
        setScopedStorageItem(userIdRef.current, "active_session_id", currentSessionId);
      }
    } catch {
      currentSessionId = crypto.randomUUID();
    }

    // Anchor conversation for cross-experience orchestration
    setConversationAnchor({
      sessionId: currentSessionId,
      lastUserMessage: text,
      lastTopic: text.length > 36 ? text.slice(0, 36) + "..." : text,
      timestamp: Date.now(),
    });

    // Check if user spoke/typed a command to transition to another experience
    const cmd = parseVoiceExperienceCommand(text);
    if (cmd && (cmd.action === "open" || cmd.action === "suggest")) {
      setPendingExperience({
        type: cmd.type,
        title: cmd.title,
        path: cmd.targetRoute,
        reason: cmd.reason || "Transition to recommended experience",
      });
    }

    let personalization: any = {};
    try {
      personalization = getScopedStorageItem<any>(userIdRef.current, "user_personalization", {}) || {};
    } catch {}

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: currentSessionId,
          personalization,
          is_voice: mode === "voice",
        }),
      });

      const data = await res.json();
      const reply = data.content || "I am here with you. Take a gentle breath.";
      setIsLoading(false);
      setTargetAnswer(reply);
      setIsWriting(true);

      // Speak reply naturally in voice mode
      if (mode === "voice") {
        speakVoiceReply(reply);
      }

      // Automatically surface experience cards for literature or music suggestions
      const lowerText = text.toLowerCase();
      if (
        data.literature &&
        (lowerText.includes("book") ||
          lowerText.includes("read") ||
          lowerText.includes("poem") ||
          lowerText.includes("shayari") ||
          lowerText.includes("literature") ||
          lowerText.includes("suggest") ||
          lowerText.includes("quote") ||
          lowerText.includes("line"))
      ) {
        setPendingExperience({
          type: "book",
          title: data.literature.source?.work || "Recommended Literature",
          path: "/app/words",
          reason: `Recommended: ${data.literature.source?.work} by ${data.literature.source?.author}`,
        });
      } else if (
        data.music &&
        (lowerText.includes("music") ||
          lowerText.includes("song") ||
          lowerText.includes("sound") ||
          lowerText.includes("tune") ||
          lowerText.includes("melody"))
      ) {
        setPendingExperience({
          type: "music",
          title: data.music.title || "Recommended Music",
          path: "/app/music",
          reason: `Calibrated for your current state: ${data.music.title}`,
        });
      }

      // Save to recent conversations for Home Sanctuary and Journey strictly scoped to user
      try {
        const existing = getScopedStorageItem<any[]>(userIdRef.current, "recent_conversations", []) || [];
        const newEntry = {
          title: text.length > 38 ? text.slice(0, 38) + "..." : text,
          time: "Just now",
          fullMessage: text,
          reply,
          timestamp: Date.now(),
        };
        setScopedStorageItem(
          userIdRef.current,
          "recent_conversations",
          [newEntry, ...existing.filter((e: any) => e.title !== newEntry.title)].slice(0, 10)
        );
      } catch {}
    } catch {
      setIsLoading(false);
      const fallback = "I'm listening to you. Whatever is on your mind, you are safe here. Take all the time you need.";
      setTargetAnswer(fallback);
      setIsWriting(true);
      if (mode === "voice") {
        speakVoiceReply(fallback);
      }
    }
  };

  // Reset silence timer to allow user to take their time while pausing
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    // 9 seconds of complete silence before softly auto-finalizing
    silenceTimerRef.current = setTimeout(() => {
      if (accumulatedTranscriptRef.current.trim()) {
        const text = accumulatedTranscriptRef.current.trim();
        stopListening();
        handleSend(text);
      }
    }, 9000);
  };

  const startListening = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setSpeechError(null);
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please type or use text mode.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // CONTINUOUS = true allows user to pause and think without prematurely killing recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      accumulatedTranscriptRef.current = "";
      setSpeechTranscript("");

      recognition.onspeechstart = () => {
        // Voice Barge-in: cancel any speaking utterance immediately when user begins talking
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
          } catch {}
        }
      };

      recognition.onstart = () => {
        setIsListening(true);
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
          } catch {}
        }
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        // Voice Barge-in assurance
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
          } catch {}
        }

        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? " " : "") + trans;
          } else {
            interim += trans;
          }
        }
        const fullCurrent = (accumulatedTranscriptRef.current + " " + interim).trim();
        setSpeechTranscript(fullCurrent);
        resetSilenceTimer();
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition warning:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission was denied. Please allow microphone access in browser settings.");
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // If user didn't explicitly stop and we're still marked listening, restart unless finalized
        if (isListening && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListen = () => {
    if (isListening) {
      const current = (speechTranscript || accumulatedTranscriptRef.current).trim();
      stopListening();
      if (current) {
        handleSend(current);
      }
    } else {
      startListening();
    }
  };

  const clearChat = () => {
    if (confirm("Would you like to clear your current Sanctuary reflection history?")) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      setMessages([]);
      removeScopedStorageItem(userIdRef.current, "talk_messages");
      removeScopedStorageItem(userIdRef.current, "active_session_id");
    }
  };

  return (
    <EchoSoulShell activePath="/app/talk">
      <div className="space-y-4">
        {/* Title Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-cormorant text-[#FFF8E1]">A space to be heard.</h1>
            <p className="text-sm font-manrope text-[#CFC5B5]">Talk freely. Type or use your voice.</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-manrope text-[#9AA8B0] hover:text-[#FFF8E1] transition-all"
              title="Clear conversation canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Canvas</span>
            </button>
          )}
        </div>

        {/* Main Talk Canvas + Tools Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Interactive Stage */}
          <div className="lg:col-span-8 rounded-3xl relative overflow-hidden border border-white/10 bg-[#09141D] min-h-[520px] flex flex-col justify-between p-6 sm:p-8">
            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/tabs/talk_bg.jpg"
                alt="Sanctuary ambient background"
                fill
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#070D12]/70 via-transparent to-[#070D12]/90" />
            </div>

            {/* Mode Switcher Pill */}
            <div className="relative z-10 flex justify-center">
              <div className="inline-flex p-1 rounded-full bg-[#0C1B25]/90 border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setMode("text")}
                  className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-manrope transition-all ${
                    mode === "text"
                      ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                      : "text-[#CFC5B5] hover:text-[#FFF8E1]"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => setMode("voice")}
                  className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-manrope transition-all ${
                    mode === "voice"
                      ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                      : "text-[#CFC5B5] hover:text-[#FFF8E1]"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice</span>
                </button>
                <button
                  onClick={() => setMode("upload")}
                  className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-manrope transition-all ${
                    mode === "upload"
                      ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                      : "text-[#CFC5B5] hover:text-[#FFF8E1]"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Center Area: Glowing Mic State or Conversation Stream */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
              {messages.length === 0 && !isWriting ? (
                <div className="text-center space-y-4 max-w-lg mx-auto">
                  {/* Glowing Pulse Mic Button */}
                  <div className="relative mx-auto flex items-center justify-center">
                    <div
                      className={`absolute w-48 h-48 rounded-full bg-[#F2D78A]/10 border border-[#F2D78A]/30 transition-all duration-700 ${
                        isListening ? "scale-125 animate-ping opacity-60" : "scale-100"
                      }`}
                    />
                    <div
                      className={`absolute w-36 h-36 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/40 transition-all duration-500 ${
                        isListening ? "animate-pulse" : ""
                      }`}
                    />
                    <button
                      onClick={toggleListen}
                      className={`relative w-28 h-28 rounded-full bg-[#0C1B25] border-2 transition-all flex items-center justify-center shadow-[0_0_50px_rgba(242,215,138,0.35)] hover:scale-105 active:scale-95 group cursor-pointer ${
                        isListening
                          ? "border-[#EF4444] text-[#EF4444]"
                          : "border-[#F2D78A] text-[#F2D78A]"
                      }`}
                      title={isListening ? "Click to submit reflection" : "Click to speak"}
                    >
                      <Mic className={`w-10 h-10 transition-transform ${isListening ? "scale-110 animate-pulse" : ""}`} />
                    </button>
                  </div>

                  {/* Encouraging Tagline while listening or idle */}
                  <div className="pt-2 space-y-1.5">
                    <p className="font-cormorant italic text-xl text-[#F2D78A]">
                      {isListening ? "Take all the time you need. I am listening..." : "Speak your mind. No judgment, just understanding."}
                    </p>
                    <p className="text-xs font-manrope text-[#9AA8B0]">
                      {isListening
                        ? "Pauses are completely welcome. Gather your thoughts and click Submit when ready."
                        : "Click the glowing circle to speak with your voice, or type below."}
                    </p>
                  </div>

                  {/* Live Speech Transcript Box */}
                  {isListening && (
                    <div className="space-y-3 pt-2">
                      <div className="bg-[#0C1B25]/90 border border-[#F2D78A]/40 rounded-2xl p-4 shadow-xl text-left max-w-md mx-auto">
                        <span className="text-[10px] font-manrope uppercase tracking-wider text-[#F2D78A] block mb-1">
                          Listening to your voice...
                        </span>
                        <p className="font-cormorant italic text-base text-[#FFF8E1] min-h-[30px]">
                          {speechTranscript ? `“${speechTranscript}”` : "Listening... speak whenever you are ready."}
                        </p>
                      </div>

                      {/* Explicit Submit Reflection Button */}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const current = (speechTranscript || accumulatedTranscriptRef.current).trim();
                            stopListening();
                            if (current) handleSend(current);
                          }}
                          disabled={!speechTranscript.trim()}
                          className="px-6 py-2 rounded-full btn-gold-primary text-xs font-semibold shadow-lg hover:scale-102 transition-transform disabled:opacity-40 cursor-pointer"
                        >
                          Submit Reflection →
                        </button>
                        <button
                          type="button"
                          onClick={stopListening}
                          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-manrope text-[#CFC5B5] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {speechError && (
                    <p className="text-xs font-manrope text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl px-3 py-1.5 max-w-sm mx-auto">
                      {speechError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-xl space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {/* Persistent Voice Bar if mode is voice */}
                  {mode === "voice" && (
                    <div className="p-3 rounded-2xl bg-[#0C1B25]/90 border border-[#F2D78A]/30 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={toggleListen}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isListening
                              ? "bg-[#EF4444] text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                              : "btn-gold-primary shadow-md"
                          }`}
                          title={isListening ? "Stop / Submit voice" : "Speak with your microphone"}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="text-xs font-manrope font-semibold text-[#FFF8E1]">
                            {isListening ? "Listening with care..." : "Voice Mode Active"}
                          </p>
                          <p className="text-[10px] text-[#9AA8B0] font-manrope">
                            {isListening ? "Speak freely. Pauses are welcome." : "Tap microphone to speak your thoughts"}
                          </p>
                        </div>
                      </div>
                      {isListening ? (
                        <button
                          type="button"
                          onClick={() => {
                            const current = (speechTranscript || accumulatedTranscriptRef.current).trim();
                            stopListening();
                            if (current) handleSend(current);
                          }}
                          className="px-3 py-1 rounded-full btn-gold-primary text-[10px] font-semibold cursor-pointer"
                        >
                          Submit →
                        </button>
                      ) : (
                        <span className="text-[10px] font-manrope text-[#F2D78A]">Ready</span>
                      )}
                    </div>
                  )}

                  {messages.map((m, i) => {
                    const typo = m.role === "assistant" ? getLiteratureTypography(m.text) : null;
                    return (
                      <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {m.role === "user" ? (
                          <div className="max-w-[85%] rounded-2xl bg-[#12222E] border border-white/10 px-4 py-2.5 text-xs font-manrope text-[#FFF8E1] shadow-md">
                            {m.text}
                          </div>
                        ) : (
                          <div className="max-w-[92%] rounded-2xl bg-[#0C1B25]/95 text-[#FFF8E1] p-5 shadow-2xl border border-[#F2D78A]/30 relative backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/10">
                              <span className="w-2 h-2 rounded-full bg-[#F2D78A]" />
                              <span className="text-[11px] font-manrope text-[#F2D78A] uppercase tracking-wider font-semibold">
                                Solenne Reflection
                              </span>
                            </div>
                            <div className={`font-cormorant text-base sm:text-lg leading-relaxed text-[#FFF8E1] ${typo?.fontClass || ""} ${typo?.isRtl ? "text-right" : "text-left"}`}>
                              {m.text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Active Inscribing Card */}
                  {isWriting && (
                    <div className="max-w-[92%] rounded-2xl bg-[#0C1B25]/95 text-[#FFF8E1] p-5 shadow-2xl border border-[#F2D78A]/30 relative animate-fadeIn backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/10">
                        <span className="w-2 h-2 rounded-full bg-[#F2D78A] animate-pulse" />
                        <span className="text-[11px] font-manrope text-[#F2D78A] uppercase tracking-wider font-semibold">
                          Solenne Inscribing...
                        </span>
                      </div>
                      <p className="font-cormorant italic text-base sm:text-lg leading-relaxed text-[#FFF8E1]">
                        {writtenText}
                        <span className="inline-block w-1.5 h-4 bg-[#F2D78A] ml-1 animate-pulse align-middle" />
                      </p>
                    </div>
                  )}

                  {isLoading && !isWriting && (
                    <div className="flex items-center gap-2 text-xs font-manrope text-[#F2D78A] py-2">
                      <div className="w-2 h-2 rounded-full bg-[#F2D78A] animate-ping" />
                      <span>Solenne is reflecting on your words...</span>
                    </div>
                  )}

                  {/* Live speech preview during multi-turn conversation */}
                  {isListening && (
                    <div className="p-3.5 rounded-xl bg-[#0C1B25]/95 border border-[#F2D78A]/40 text-xs text-[#FFF8E1] space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-[#F2D78A]">
                        <span className="font-semibold text-[10px] uppercase tracking-wider">Listening to you...</span>
                        <span className="text-[10px] text-[#9AA8B0]">Take your time</span>
                      </div>
                      <p className="font-cormorant italic text-sm text-[#FFF8E1]">
                        {speechTranscript || "Listening..."}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const current = (speechTranscript || accumulatedTranscriptRef.current).trim();
                            stopListening();
                            if (current) handleSend(current);
                          }}
                          disabled={!speechTranscript.trim()}
                          className="px-4 py-1.5 rounded-full btn-gold-primary text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                        >
                          Submit Reflection →
                        </button>
                        <button
                          type="button"
                          onClick={stopListening}
                          className="px-3 py-1.5 rounded-full bg-white/10 text-[11px] text-[#CFC5B5]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cross-Experience Invitation Card */}
                  {pendingExperience && (
                    <div className="p-4 rounded-2xl bg-[#0C1B25]/95 border border-[#F2D78A]/40 shadow-xl space-y-3 animate-fadeIn backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#F2D78A]" />
                          <span className="text-[11px] font-manrope text-[#F2D78A] uppercase tracking-wider font-semibold">
                            Step into {pendingExperience.title}?
                          </span>
                        </div>
                        <button
                          onClick={() => setPendingExperience(null)}
                          className="p-1 rounded-full text-[#9AA8B0] hover:text-[#FFF8E1]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-manrope text-[#CFC5B5] leading-relaxed">
                        {pendingExperience.reason}. Your conversation will remain securely anchored so you can return at any moment.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            pushExperience(pendingExperience.type, pendingExperience.title, pendingExperience.path);
                            router.push(pendingExperience.path);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <span>Open {pendingExperience.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingExperience(null)}
                          className="px-3.5 py-1.5 rounded-full bg-white/5 text-xs text-[#9AA8B0] hover:text-[#FFF8E1]"
                        >
                          Stay in conversation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Text + Mic Input Bar */}
            <div className="relative z-10 pt-4 border-t border-white/5 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center bg-[#0C1B25]/90 border border-white/10 rounded-full px-3 py-1.5 shadow-xl focus-within:border-[#F2D78A]/60 transition-colors"
              >
                {/* Embedded Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListen}
                  className={`p-2 rounded-full transition-colors cursor-pointer mr-1 ${
                    isListening
                      ? "text-[#EF4444] bg-[#EF4444]/10 animate-pulse"
                      : "text-[#F2D78A] hover:text-[#FFF8E1] hover:bg-white/5"
                  }`}
                  title={isListening ? "Stop / Submit voice" : "Speak with your microphone"}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? "Listening to your voice... (or type here)" : "Type anything you wish to share..."}
                  className="flex-1 bg-transparent border-none text-xs font-manrope text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !speechTranscript.trim()}
                  className="p-2 rounded-full btn-gold-primary disabled:opacity-30 transition-all ml-1 cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5 text-[#0B0F14]" />
                </button>
              </form>

              {/* Tagline footer banner */}
              <p className="text-[11px] font-manrope text-center text-[#9AA8B0]/70">
                &ldquo;Speak your mind. No judgment, just understanding.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Tools Sidebar (Matching wireframe) */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09141D] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-cormorant text-lg font-semibold text-[#FFF8E1] border-b border-white/10 pb-3">
                Conversation Tools
              </h2>

              <div className="space-y-2">
                {[
                  {
                    icon: <Lightbulb className="w-4 h-4 text-[#F2D78A]" />,
                    title: "Get insights",
                    prompt: "Can you give me key insights on what we just discussed?",
                  },
                  {
                    icon: <Bookmark className="w-4 h-4 text-[#F2D78A]" />,
                    title: "Save as moment",
                    prompt: "Help me capture this conversation into a permanent moment card.",
                  },
                  {
                    icon: <BookOpen className="w-4 h-4 text-[#F2D78A]" />,
                    title: "Find relevant books",
                    prompt: "What books relate directly to what I'm feeling right now?",
                  },
                  {
                    icon: <Compass className="w-4 h-4 text-[#F2D78A]" />,
                    title: "Get practical guidance",
                    prompt: "What are 3 practical steps I can do next?",
                  },
                  {
                    icon: <Map className="w-4 h-4 text-[#F2D78A]" />,
                    title: "Explore next steps",
                    prompt: "Help me plan my direction for tomorrow.",
                  },
                ].map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(tool.prompt)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#0C1B25]/80 hover:bg-[#0C1B25] border border-white/5 hover:border-[#F2D78A]/30 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#F2D78A]/10 transition-colors">
                        {tool.icon}
                      </div>
                      <span className="text-xs font-manrope text-[#CFC5B5] group-hover:text-[#FFF8E1]">
                        {tool.title}
                      </span>
                    </div>
                    <span className="text-xs text-[#9AA8B0] group-hover:text-[#F2D78A] transition-colors">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Supportive Quote */}
            <div className="rounded-2xl p-4 bg-[#0C1B25]/50 border border-white/5 text-center space-y-1">
              <p className="font-cormorant italic text-sm text-[#F2D78A]">
                &ldquo;Your thoughts matter. I&apos;m here, always.&rdquo;
              </p>
              <p className="text-[10px] text-[#9AA8B0] font-manrope">
                Speak your mind. No judgment, just understanding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </EchoSoulShell>
  );
}
