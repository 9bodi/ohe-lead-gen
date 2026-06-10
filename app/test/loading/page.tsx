"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");

  // 3 messages qui défilent pour donner un sentiment de "calcul approfondi"
  const messages = [
    "Analyse de vos réponses...",
    "Calcul des scores par compétence...",
    "Préparation de votre relevé...",
  ];
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const MESSAGE_DURATION = 1200; // ms par message
  const TOTAL_DURATION = messages.length * MESSAGE_DURATION; // 3600 ms

  useEffect(() => {
    if (!resultId) {
      router.push("/");
      return;
    }

    const redirectTimer = setTimeout(() => {
      router.push(`/result/${resultId}`);
    }, TOTAL_DURATION);

    // Rotation des messages avec fondu
    const messageTimer = setInterval(() => {
      // 1) fondu sortant
      setVisible(false);
      // 2) changement du texte + fondu entrant, après la fin du fade out
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 300);
    }, MESSAGE_DURATION);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(messageTimer);
    };
  }, [resultId, router, messages.length, TOTAL_DURATION]);

  if (!resultId) return null;

  return (
    <main className="min-h-screen grid place-items-center bg-ohe-bg text-ohe-ink relative overflow-hidden px-6">
      {/* Watermark décoratif */}
      <div
        className="absolute pointer-events-none select-none font-serif text-[220px] sm:text-[320px] lg:text-[420px] -right-10 -bottom-16 sm:-right-14 sm:-bottom-24 lg:-right-[60px] lg:-bottom-[120px]"
        style={{
          lineHeight: 1,
          color: "var(--color-ohe-accent-soft)",
        }}
      >
        
      </div>

      <div className="text-center max-w-md relative z-10">
        <div className="text-ohe-accent mb-8 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] sm:tracking-[0.28em]">
          <span className="opacity-65"></span>
          <span>Votre résultat est en préparation</span>
        </div>

        {/* Animation : 3 points qui pulsent */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-ohe-accent"
              style={{
                animation: "ohePulse 1.6s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Message qui change avec fondu */}
        <p
          className="text-ohe-muted text-base font-serif italic transition-opacity duration-300 px-2"
          style={{ minHeight: "1.5em", opacity: visible ? 1 : 0 }}
        >
          {messages[messageIndex]}
        </p>
      </div>

      <style jsx>{`
        @keyframes ohePulse {
          0%, 80%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </main>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ohe-bg" />}>
      <LoadingContent />
    </Suspense>
  );
}
