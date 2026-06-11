"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DECLARATIVES,
  PROCEDURAL_COUNT,
  PROCEDURAL_SECONDS_PER_QUESTION,
  shuffleAllProcedural,
  type ProceduralQuestion,
  type DeclarativeQuestion,
} from "@/lib/questions";
import type { RawAnswer } from "@/lib/scoring/compute";

// === Types ===

export type TestPhase =
  | "loading"       // état initial, en attente du mélange côté client
  | "procedural"    // 16 questions accords + conjugaison mélangées
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
  reset: () => void;
};

// === Hook ===

export function useTest(): UseTestState {
  // === 16 questions procédurales mélangées (accords + conjugaison fusionnés) ===
  // null tant que le shuffle n'a pas eu lieu (côté serveur)
  const [proceduralQuestions, setProceduralQuestions] = useState<ProceduralQuestion[] | null>(null);

  // === Mélange UNE seule fois au montage (côté client uniquement) ===
  // useEffect ne s'exécute jamais côté serveur, donc pas de mismatch d'hydration.
  useEffect(() => {
    setProceduralQuestions(shuffleAllProcedural());
  }, []);

  // === États ===
  const [phase, setPhase] = useState<TestPhase>("loading");
  const [proceduralIndex, setProceduralIndex] = useState(0);
  const [declarativeIndex, setDeclarativeIndex] = useState(0);
  const [answers, setAnswers] = useState<RawAnswer[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(PROCEDURAL_SECONDS_PER_QUESTION);
  const [startedAt] = useState(() => Date.now());

  const questionStartRef = useRef(Date.now());

  // === Passer de "loading" à "procedural" dès que le shuffle est fait ===
  useEffect(() => {
    if (phase === "loading" && proceduralQuestions) {
      setPhase("procedural");
      questionStartRef.current = Date.now();
    }
  }, [phase, proceduralQuestions]);

  // === Question courante ===
  const currentQuestion = useMemo((): ProceduralQuestion | DeclarativeQuestion | null => {
    if (phase === "procedural" && proceduralQuestions) {
      return proceduralQuestions[proceduralIndex] ?? null;
    }
    if (phase === "declaratives") {
      return DECLARATIVES[declarativeIndex] ?? null;
    }
    return null;
  }, [phase, proceduralIndex, declarativeIndex, proceduralQuestions]);

  // === Reset du timer à chaque nouvelle question procédurale ===
  useEffect(() => {
    if (phase === "procedural") {
      setSecondsLeft(PROCEDURAL_SECONDS_PER_QUESTION);
      questionStartRef.current = Date.now();
    } else if (phase === "declaratives") {
      questionStartRef.current = Date.now();
    }
  }, [phase, proceduralIndex, declarativeIndex]);

  // === Tick du timer (uniquement en phase procédurale) ===
  useEffect(() => {
    if (phase !== "procedural") return;

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
  // Plus de transition : on passe directement aux déclaratives après la 16e question
  const advanceFromProcedural = useCallback(() => {
    setProceduralIndex((idx) => {
      const next = idx + 1;
      if (next === PROCEDURAL_COUNT) {
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

  const reset = useCallback(() => {
    setPhase("loading");
    setProceduralQuestions(shuffleAllProcedural());
    setProceduralIndex(0);
    setDeclarativeIndex(0);
    setAnswers([]);
    setSecondsLeft(PROCEDURAL_SECONDS_PER_QUESTION);
    questionStartRef.current = Date.now();
    setPhase("procedural");
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
    reset,
  };
}