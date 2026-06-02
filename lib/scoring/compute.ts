// Calcul du score freemium selon le CDC V1.0 (section 3)
//
// Sortie :
// - 2 scores de bloc (corrects /8 + score 0/0.5/0.75/1 + niveau)
// - 1 score ADAPTATION (sur 3) + profil adapté/non adapté

import {
  BLOCK_1,
  BLOCK_2,
  DECLARATIVES,
  type ProceduralQuestion,
  type DeclarativeQuestion,
} from "@/lib/questions";

// === Types ===

export type BlockLevel = "non_maitrise" | "fragile" | "fonctionnel" | "maitrise";
export type AdaptationProfile = "adapted" | "not_adapted";

export type BlockResult = {
  correct: number;       // ex: 6
  total: number;         // ex: 8
  score: number;         // 0 / 0.5 / 0.75 / 1
  level: BlockLevel;
  /** Label FR pour affichage */
  label: string;
  /** Couleur du niveau pour l'UI */
  color: "red" | "orange" | "blue" | "green";
};

export type AdaptationResult = {
  score: number;              // 0 à 3
  total: number;              // 3
  profile: AdaptationProfile;
};

export type ScoreResult = {
  block1: BlockResult;
  block2: BlockResult;
  adaptation: AdaptationResult;
  /** Réponses détaillées pour stockage et audit */
  rawAnswers: RawAnswer[];
};

export type RawAnswer = {
  questionId: string;
  /** Pour les procédurales : texte du choix sélectionné. Pour les déclaratives : "yes" ou "no". null si pas répondu (timeout) */
  answer: string | null;
  /** Pour les procédurales : true/false. Pour les déclaratives : null (pas de notion de "correct") */
  isCorrect: boolean | null;
  /** Temps pris pour répondre (en ms) */
  answeredInMs: number;
};

// === Helpers d'évaluation par bloc ===

function evaluateBlock(
  questions: ProceduralQuestion[],
  answersByQid: Map<string, RawAnswer>
): BlockResult {
  let correct = 0;
  for (const q of questions) {
    const a = answersByQid.get(q.id);
    if (a?.isCorrect === true) correct++;
  }

  const total = questions.length;

  // Seuils CDC section 3.1 (sur 8 questions par bloc)
  let score: number;
  let level: BlockLevel;
  let label: string;
  let color: BlockResult["color"];

  if (correct <= 2) {
    score = 0;
    level = "non_maitrise";
    label = "Non maîtrisé";
    color = "red";
  } else if (correct <= 4) {
    score = 0.5;
    level = "fragile";
    label = "Fragile";
    color = "orange";
  } else if (correct <= 6) {
    score = 0.75;
    level = "fonctionnel";
    label = "Fonctionnel";
    color = "blue";
  } else {
    score = 1;
    level = "maitrise";
    label = "Maîtrisé";
    color = "green";
  }

  return { correct, total, score, level, label, color };
}

// === Helper d'évaluation du profil ADAPTATION ===

function evaluateAdaptation(
  questions: DeclarativeQuestion[],
  answersByQid: Map<string, RawAnswer>
): AdaptationResult {
  let score = 0;
  for (const q of questions) {
    const a = answersByQid.get(q.id);
    if (!a || a.answer === null) continue;
    // La réponse est "adaptée" si elle correspond à adaptedAnswer
    if (a.answer === q.adaptedAnswer) score++;
  }

  const total = questions.length;
  const profile: AdaptationProfile = score >= 2 ? "adapted" : "not_adapted";

  return { score, total, profile };
}

// === Fonction principale ===

export type ComputeScoreInput = {
  answers: RawAnswer[];
};

export function computeScore(input: ComputeScoreInput): ScoreResult {
  const answersByQid = new Map<string, RawAnswer>();
  for (const a of input.answers) {
    answersByQid.set(a.questionId, a);
  }

  const block1 = evaluateBlock(BLOCK_1, answersByQid);
  const block2 = evaluateBlock(BLOCK_2, answersByQid);
  const adaptation = evaluateAdaptation(DECLARATIVES, answersByQid);

  return {
    block1,
    block2,
    adaptation,
    rawAnswers: input.answers,
  };
}

// === Helper : retourne le message personnalisé (section 5.2 du CDC) ===

export function getResultMessage(result: ScoreResult): string {
  const totalScore = result.block1.score + result.block2.score;
  const isAdapted = result.adaptation.profile === "adapted";
  // CDC : seuil "scores procéduraux faibles" = 0-0.5 par bloc → ≤ 1 cumulé
  //       seuil "scores procéduraux bons"   = 0.75-1 par bloc → ≥ 1.5 cumulé
  const isLowScore = totalScore <= 1;

  if (isLowScore && isAdapted) {
    return "Vos résultats révèlent des axes de progression en accords et conjugaison. Votre profil correspond exactement au public que la formation OHé accompagne.";
  }
  if (!isLowScore && isAdapted) {
    return "Vous maîtrisez bien les accords et la conjugaison. Le diagnostic complet révèle si vos autres compétences atteignent le même niveau.";
  }
  if (isLowScore && !isAdapted) {
    return "Vos résultats montrent des difficultés à l'écrit. Nous vous invitons à nous contacter pour trouver la solution adaptée à votre situation.";
  }
  // !isLowScore && !isAdapted
  return "Vos résultats sont bons sur ces deux compétences. Votre profil suggère que la formation OHé n'est peut-être pas la priorité — contactez-nous pour en discuter.";
}
