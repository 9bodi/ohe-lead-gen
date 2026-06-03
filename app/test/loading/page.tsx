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

  useEffect(() => {
    // Redirige vers le résultat après 2.5 sec
    if (!resultId) {
      router.push("/");
      return;
    }

    const redirectTimer = setTimeout(() => {
      router.push(`/result/${resultId}`);
    }, 2500);

    // Rotation des messages toutes les 850ms
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 850);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(messageTimer);
    };
  }, [resultId, router, messages.length]);

  if (!resultId) return null;

  return (
    <main className="min-h-screen grid place-items-center bg-ohe-bg text-ohe-ink relative overflow-hidden">
      {/* Watermark décoratif */}
      <div
        className="absolute pointer-events-none select-none font-serif"
        style={{
          right: -60,
          bottom: -120,
          fontSize: 420,
          lineHeight: 1,
          color: "var(--color-ohe-accent-soft)",
        }}
      >
        ✱
      </div>

      <div className="text-center max-w-md relative z-10">
        <div className="ohe-eyebrow text-ohe-accent mb-8">
          ✱ Votre résultat est en préparation
        </div>

        {/* Animation : 3 points qui pulsent */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-ohe-accent"
              style={{
                animation: "ohePulse 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Message qui change */}
        <p
          className="text-ohe-muted text-base font-serif italic transition-opacity duration-500"
          style={{ minHeight: "1.5em" }}
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
