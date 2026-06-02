"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BLOCK_1,
  BLOCK_2,
  DECLARATIVES,
  PROCEDURAL_SECONDS_PER_QUESTION,
  shuffleBlock,
  type ProceduralQuestion,
  type DeclarativeQuestion,
} from "@/lib/questions";
import type { RawAnswer } from "@/lib/scoring/compute";

// === Types ===

export type TestPhase =
  | "loading"       // état initial, en attente du mélange côté client
  | "block1"        // Bloc 1 — accords
  | "transition"    // Écran transition entre les 2 blocs procéduraux
  | "block2"        // Bloc 2 — conjugaison
  | "declaratives"  // 3 questions ADAPTATION
  | "completed";    // Test terminé

export type CurrentQuestion =
  | { kind: "procedural"; question: ProceduralQuestion; secondsLeft: number }
  | { kind: "declarative"; question: DeclarativeQuestion }
  | { kind: "none" };

export type UseTestState = {
  phase: TestPhase;
  proceduralIndex: number;
  declarativeIndex: number;
  current: CurrentQuestion;
  answers: RawAnswer[];
  startedAt: number;
  answerProcedural: (choiceText: string) => void;
  answerDeclarative: (answer: "yes" | "no") => void;
  finishTransition: () => void;
  reset: () => void;
};

// === Hook ===

export function useTest(): UseTestState {
  // === Questions mélangées — null tant que le shuffle n'a pas eu lieu (côté serveur) ===
  // On stocke en state pour pouvoir muter côté client uniquement.
  const [block1Questions, setBlock1Questions] = useState<ProceduralQuestion[] | null>(null);
  const [block2Questions, setBlock2Questions] = useState<ProceduralQuestion[] | null>(null);

  // === Mélange UNE seule fois au montage (côté client uniquement) ===
  // useEffect ne s'exécute jamais côté serveur, donc pas de mismatch d'hydration.
  useEffect(() => {
    setBlock1Questions(shuffleBlock(BLOCK_1));
    setBlock2Questions(shuffleBlock(BLOCK_2));
  }, []);

  // === États ===
  const [phase, setPhase] = useState<TestPhase>("loading");
  const [proceduralIndex, setProceduralIndex] = useState(0);
  const [declarativeIndex, setDeclarativeIndex] = useState(0);
  const [answers, setAnswers] = useState<RawAnswer[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(PROCEDURAL_SECONDS_PER_QUESTION);
  const [startedAt] = useState(() => Date.now());

  const questionStartRef = useRef(Date.now());

  // === Passer de "loading" à "block1" dès que le shuffle est fait ===
  useEffect(() => {
    if (phase === "loading" && block1Questions && block2Questions) {
      setPhase("block1");
      questionStartRef.current = Date.now();
    }
  }, [phase, block1Questions, block2Questions]);

  // === Question courante ===
  const currentQuestion = useMemo((): ProceduralQuestion | DeclarativeQuestion | null => {
    if (phase === "block1" && block1Questions) {
      return block1Questions[proceduralIndex] ?? null;
    }
    if (phase === "block2" && block2Questions) {
      return block2Questions[proceduralIndex - 8] ?? null;
    }
    if (phase === "declaratives") {
      return DECLARATIVES[declarativeIndex] ?? null;
    }
    return null;
  }, [phase, proceduralIndex, declarativeIndex, block1Questions, block2Questions]);

  // === Reset du timer à chaque nouvelle question procédurale ===
  useEffect(() => {
    if (phase === "block1" || phase === "block2") {
      setSecondsLeft(PROCEDURAL_SECONDS_PER_QUESTION);
      questionStartRef.current = Date.now();
    } else if (phase === "declaratives") {
      questionStartRef.current = Date.now();
    }
  }, [phase, proceduralIndex, declarativeIndex]);

  // === Tick du timer (uniquement en phase procédurale) ===
  useEffect(() => {
    if (phase !== "block1" && phase !== "block2") return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, proceduralIndex]);

  // === Handler de timeout ===
  const handleTimeout = useCallback(() => {
    if (!currentQuestion || currentQuestion.type !== "procedural") return;
    const answeredInMs = Date.now() - questionStartRef.current;
    const newAnswer: RawAnswer = {
      questionId: currentQuestion.id,
      answer: null,
      isCorrect: false,
      answeredInMs,
    };
    setAnswers((prev) => [...prev, newAnswer]);
    advanceFromProcedural();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  // === Avancer après une réponse procédurale ===
  const advanceFromProcedural = useCallback(() => {
    setProceduralIndex((idx) => {
      const next = idx + 1;
      if (next === 8) {
        setPhase("transition");
        return next;
      }
      if (next === 16) {
        setPhase("declaratives");
        return next;
      }
      return next;
    });
  }, []);

  // === Avancer après une réponse déclarative ===
  const advanceFromDeclarative = useCallback(() => {
    setDeclarativeIndex((idx) => {
      const next = idx + 1;
      if (next === DECLARATIVES.length) {
        setPhase("completed");
      }
      return next;
    });
  }, []);

  // === Actions exposées ===

  const answerProcedural = useCallback(
    (choiceText: string) => {
      if (!currentQuestion || currentQuestion.type !== "procedural") return;

      const choice = currentQuestion.choices.find((c) => c.text === choiceText);
      const isCorrect = choice?.correct === true;
      const answeredInMs = Date.now() - questionStartRef.current;

      const newAnswer: RawAnswer = {
        questionId: currentQuestion.id,
        answer: choiceText,
        isCorrect,
        answeredInMs,
      };
      setAnswers((prev) => [...prev, newAnswer]);
      advanceFromProcedural();
    },
    [currentQuestion, advanceFromProcedural]
  );

  const answerDeclarative = useCallback(
    (answer: "yes" | "no") => {
      if (!currentQuestion || currentQuestion.type !== "declarative") return;

      const answeredInMs = Date.now() - questionStartRef.current;
      const newAnswer: RawAnswer = {
        questionId: currentQuestion.id,
        answer,
        isCorrect: null,
        answeredInMs,
      };
      setAnswers((prev) => [...prev, newAnswer]);
      advanceFromDeclarative();
    },
    [currentQuestion, advanceFromDeclarative]
  );

  const finishTransition = useCallback(() => {
    if (phase === "transition") {
      setPhase("block2");
    }
  }, [phase]);

  const reset = useCallback(() => {
    setPhase("loading");
    setBlock1Questions(shuffleBlock(BLOCK_1));
    setBlock2Questions(shuffleBlock(BLOCK_2));
    setProceduralIndex(0);
    setDeclarativeIndex(0);
    setAnswers([]);
    setSecondsLeft(PROCEDURAL_SECONDS_PER_QUESTION);
    questionStartRef.current = Date.now();
    setPhase("block1");
  }, []);

  // === Objet `current` exposé ===
  const current: CurrentQuestion = useMemo(() => {
    if (!currentQuestion) return { kind: "none" };
    if (currentQuestion.type === "procedural") {
      return { kind: "procedural", question: currentQuestion, secondsLeft };
    }
    return { kind: "declarative", question: currentQuestion };
  }, [currentQuestion, secondsLeft]);

  return {
    phase,
    proceduralIndex,
    declarativeIndex,
    current,
    answers,
    startedAt,
    answerProcedural,
    answerDeclarative,
    finishTransition,
    reset,
  };
}
