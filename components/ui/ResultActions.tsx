"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_MS = 90_000; // 90 secondes avant retour auto à l'accueil

export function ResultActions() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function goHome() {
    // Nettoyage pour le visiteur suivant (mode borne)
    try {
      sessionStorage.removeItem("test:payload");
    } catch {
      // sessionStorage indisponible — sans gravité
    }
    router.push("/");
  }

  // Timeout d'inactivité : tout geste (clic, touche, scroll, toucher) le réarme
  useEffect(() => {
    function arm() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        goHome();
      }, INACTIVITY_MS);
    }

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm(); // démarre le compte à rebours dès l'affichage du bilan

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={goHome}
      className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors shrink-0"
    >
      Terminer
    </button>
  );
}
