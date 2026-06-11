// Banque de questions du test freemium OHé
// Source : CDC Freemium V1.0 — sections 2.1, 2.2, 2.3

// === Types ===

export type ProceduralChoice = {
  /** Texte de la réponse */
  text: string;
  /** Marque la bonne réponse */
  correct?: boolean;
  /** Marque "je ne sais pas trop" (style visuel atténué) */
  unknown?: boolean;
};

export type ProceduralQuestion = {
  id: string;
  type: "procedural";
  /** Bloc d'appartenance pour le scoring */
  block: 1 | 2;
  /** Énoncé : la partie à compléter est marquée par ___ (triple underscore) */
  statement: string;
  /** Options de réponse (4 max : 3 propositions + "je ne sais pas trop") */
  choices: ProceduralChoice[];
};

export type DeclarativeQuestion = {
  id: string;
  type: "declarative";
  /** Énoncé de la question */
  statement: string;
  /** Réponse considérée "adaptée" pour le scoring ADAPTATION */
  adaptedAnswer: "yes" | "no";
};

export type Question = ProceduralQuestion | DeclarativeQuestion;

// === Consigne commune des blocs procéduraux ===
export const PROCEDURAL_PROMPT = "Quelle orthographe vous semble correcte ?";

// === BLOC 1 — Accords des mots (8 questions, 10 sec chacune) ===

const BLOCK_1_QUESTIONS: ProceduralQuestion[] = [
  {
    id: "b1q1",
    type: "procedural",
    block: 1,
    statement: "Les charges ___ sont colossales.",
    choices: [
      { text: "patronal" },
      { text: "patronale" },
      { text: "patronals" },
      { text: "patronales", correct: true },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q2",
    type: "procedural",
    block: 1,
    statement: "Les élections ___ approchent.",
    choices: [
      { text: "municipal" },
      { text: "municipale" },
      { text: "municipals" },
      { text: "municipales", correct: true },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q3",
    type: "procedural",
    block: 1,
    statement: "Je respecte les décisions ___.",
    choices: [
      { text: "présidentiel" },
      { text: "présidentielle" },
      { text: "présidentiels" },
      { text: "présidentielles", correct: true },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q4",
    type: "procedural",
    block: 1,
    statement: "Tout le monde était ___.",
    choices: [
      { text: "fier", correct: true },
      { text: "fiers" },
      { text: "fières" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q5",
    type: "procedural",
    block: 1,
    statement: "Tout le monde ___ là.",
    choices: [
      { text: "semble", correct: true },
      { text: "semblent" },
      { text: "sembles" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q6",
    type: "procedural",
    block: 1,
    statement: "L'équipe ___ après le match.",
    choices: [
      { text: "crie", correct: true },
      { text: "cris" },
      { text: "crient" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q7",
    type: "procedural",
    block: 1,
    statement: "Chacun des participants ___ son prénom.",
    choices: [
      { text: "crie", correct: true },
      { text: "cris" },
      { text: "crient" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b1q8",
    type: "procedural",
    block: 1,
    statement: "On ___.",
    choices: [
      { text: "part", correct: true },
      { text: "parts" },
      { text: "parent" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
];

// === BLOC 2 — Conjugaison des verbes (8 questions, 10 sec chacune) ===

const BLOCK_2_QUESTIONS: ProceduralQuestion[] = [
  {
    id: "b2q1",
    type: "procedural",
    block: 2,
    statement: "Je ___ tous les dimanches à la messe.",
    choices: [
      { text: "prie", correct: true },
      { text: "prit" },
      { text: "pris" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q2",
    type: "procedural",
    block: 2,
    statement: "Je ___ le dossier et m'en allai.",
    choices: [
      { text: "prie" },
      { text: "prit" },
      { text: "pris", correct: true },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q3",
    type: "procedural",
    block: 2,
    statement: "Alec a ___ une bonne décision.",
    choices: [
      { text: "prie" },
      { text: "prit" },
      { text: "pris", correct: true },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q4",
    type: "procedural",
    block: 2,
    statement: "C'est toi qui ___ le dossier.",
    choices: [
      { text: "fini" },
      { text: "finit" },
      { text: "finis", correct: true },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q5",
    type: "procedural",
    block: 2,
    statement: "Le stagiaire vous ___ le rapport avant ce soir.",
    choices: [
      { text: "fini" },
      { text: "finit", correct: true },
      { text: "finis" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q6",
    type: "procedural",
    block: 2,
    statement: "Il a hélas ___ en retard.",
    choices: [
      { text: "fini", correct: true },
      { text: "finit" },
      { text: "finis" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q7",
    type: "procedural",
    block: 2,
    statement: "Je ___ le dossier d'abord.",
    choices: [
      { text: "constitue", correct: true },
      { text: "constitut" },
      { text: "constitus" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
  {
    id: "b2q8",
    type: "procedural",
    block: 2,
    statement: "J'___ les courriels tout de suite.",
    choices: [
      { text: "envoie", correct: true },
      { text: "envoi" },
      { text: "envois" },
      { text: "je ne sais pas trop", unknown: true },
    ],
  },
];

// === Questions déclaratives — Axe ADAPTATION (3 questions, 15 sec chacune) ===

const DECLARATIVE_QUESTIONS: DeclarativeQuestion[] = [
    {
    id: "d1",
    type: "declarative",
    statement: "Maîtrisez-vous bien le français à l'oral ?",
    // Oui = adapté
    adaptedAnswer: "yes",
  },

  {
    id: "d2",
    type: "declarative",
    statement: "Avez-vous des problèmes de lecture ?",
    // Non = adapté
    adaptedAnswer: "no",
  },
  {
    id: "d3",
    type: "declarative",
    statement: "Diriez-vous que vous avez des difficultés en orthographe ?",
    // Oui = adapté (cible OHé)
    adaptedAnswer: "yes",
  },
];

// === Exports ===

export const BLOCK_1 = BLOCK_1_QUESTIONS;
export const BLOCK_2 = BLOCK_2_QUESTIONS;
export const DECLARATIVES = DECLARATIVE_QUESTIONS;

export const BLOCK_1_COUNT = BLOCK_1.length; // 8
export const BLOCK_2_COUNT = BLOCK_2.length; // 8
export const PROCEDURAL_COUNT = BLOCK_1_COUNT + BLOCK_2_COUNT; // 16
export const DECLARATIVE_COUNT = DECLARATIVES.length; // 3
export const TOTAL_COUNT = PROCEDURAL_COUNT + DECLARATIVE_COUNT; // 19
export const DISPLAY_TOTAL_COUNT = TOTAL_COUNT + 1; // 20

// Durées par question (en secondes)
export const PROCEDURAL_SECONDS_PER_QUESTION = 10;
export const DECLARATIVE_SECONDS_PER_QUESTION = 15;

// === Helper : mélanger les questions d'un bloc ===
// L'ordre des blocs reste fixe (1 puis 2), mais les questions DANS un bloc
// sont mélangées (Fisher-Yates) — comme demandé dans le CDC.
export function shuffleBlock<T>(questions: T[]): T[] {
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// === Helper : mélanger les 16 questions des 2 blocs combinés ===
// Toutes les questions sont fusionnées en une seule séquence aléatoire.
// Le champ `block` (1 ou 2) reste sur chaque question pour permettre
// le scoring par bloc à la fin du test, malgré le mélange.
export function shuffleAllProcedural(): ProceduralQuestion[] {
  return shuffleBlock([...BLOCK_1, ...BLOCK_2]);
}