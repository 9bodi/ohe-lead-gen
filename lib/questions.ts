// Banque de questions du test salon OHé
// Format : 10 procédurales (orthographe) + 3 déclaratives (qualification lead)
//
// IMPORTANT : ce contenu est PLACEHOLDER. À remplacer avec Roxane / l'équipe OHé.

export type ProceduralChoice = {
  /** Clé courte affichée dans le bouton (A, B, C, D) */
  key: string;
  /** Texte de la réponse */
  text: string;
  /** Marque la bonne réponse */
  correct?: boolean;
  /** Marque "je ne sais pas" (style visuel atténué) */
  unknown?: boolean;
};

export type ProceduralQuestion = {
  id: string;
  type: "procedural";
  /** Eyebrow affiché en haut (ex: "Homophones · ce / se / ceux") */
  category: string;
  /** Court intro avant l'énoncé (ex: "Complétez la phrase :") */
  prompt: string;
  /** Énoncé principal — peut contenir <__> qui sera remplacé par un trait souligné */
  statement: string;
  /** Options de réponse */
  choices: ProceduralChoice[];
};

export type DeclarativeChoice = {
  key: string;
  text: string;
};

export type DeclarativeQuestion = {
  id: string;
  type: "declarative";
  category: string;
  prompt: string;
  statement: string;
  choices: DeclarativeChoice[];
};

export type Question = ProceduralQuestion | DeclarativeQuestion;

// === Questions procédurales (10) ===

const PROCEDURAL_QUESTIONS: ProceduralQuestion[] = [
  {
    id: "p1",
    type: "procedural",
    category: "Homophones · ce / se / ceux",
    prompt: "Complétez la phrase :",
    statement: "« N'oublie pas <__> qui sont importants pour toi. »",
    choices: [
      { key: "A", text: "ce" },
      { key: "B", text: "se" },
      { key: "C", text: "ceux", correct: true },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p2",
    type: "procedural",
    category: "Accords du participe passé",
    prompt: "Quelle est la forme correcte ?",
    statement: "« Les lettres qu'elle m'a <__> sont arrivées hier. »",
    choices: [
      { key: "A", text: "envoyé" },
      { key: "B", text: "envoyés" },
      { key: "C", text: "envoyées", correct: true },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p3",
    type: "procedural",
    category: "Homophones · a / à",
    prompt: "Complétez la phrase :",
    statement: "« Il <__> oublié son rendez-vous <__> Paris. »",
    choices: [
      { key: "A", text: "a / à", correct: true },
      { key: "B", text: "à / a" },
      { key: "C", text: "a / a" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p4",
    type: "procedural",
    category: "Conjugaison · futur simple",
    prompt: "Quelle est la forme correcte ?",
    statement: "« Demain, nous <__> au bureau dès huit heures. »",
    choices: [
      { key: "A", text: "seront" },
      { key: "B", text: "serons", correct: true },
      { key: "C", text: "serions" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p5",
    type: "procedural",
    category: "Pluriel des noms composés",
    prompt: "Quel est le pluriel correct ?",
    statement: "« Des <__> sont arrivés ce matin. »",
    choices: [
      { key: "A", text: "porte-monnaie", correct: true },
      { key: "B", text: "portes-monnaie" },
      { key: "C", text: "portes-monnaies" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p6",
    type: "procedural",
    category: "Homophones · leur / leurs",
    prompt: "Complétez la phrase :",
    statement: "« Les enfants ont rangé <__> chambres avant de partir. »",
    choices: [
      { key: "A", text: "leur" },
      { key: "B", text: "leurs", correct: true },
      { key: "C", text: "leur's" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p7",
    type: "procedural",
    category: "Accord en genre",
    prompt: "Quelle est la forme correcte ?",
    statement: "« Cette décision est <__> à toutes les parties. »",
    choices: [
      { key: "A", text: "favorable", correct: true },
      { key: "B", text: "favorables" },
      { key: "C", text: "favorablement" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p8",
    type: "procedural",
    category: "Conjugaison · subjonctif",
    prompt: "Quelle est la forme correcte ?",
    statement: "« Il faut que tu <__> à l'heure demain. »",
    choices: [
      { key: "A", text: "es" },
      { key: "B", text: "sois", correct: true },
      { key: "C", text: "seras" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p9",
    type: "procedural",
    category: "Orthographe lexicale",
    prompt: "Quelle est l'orthographe correcte ?",
    statement: "« Nous avons reçu une <__> très détaillée. »",
    choices: [
      { key: "A", text: "réponce" },
      { key: "B", text: "réponse", correct: true },
      { key: "C", text: "réponsse" },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
  {
    id: "p10",
    type: "procedural",
    category: "Homophones · ces / ses / c'est / s'est",
    prompt: "Complétez la phrase :",
    statement: "« <__> dommage, il n'a pas pu venir. »",
    choices: [
      { key: "A", text: "Ces" },
      { key: "B", text: "Ses" },
      { key: "C", text: "C'est", correct: true },
      { key: "D", text: "Je ne sais pas", unknown: true },
    ],
  },
];

// === Questions déclaratives (3) — placées à la fin pour qualifier le lead ===

const DECLARATIVE_QUESTIONS: DeclarativeQuestion[] = [
  {
    id: "d1",
    type: "declarative",
    category: "Votre contexte",
    prompt: "Quelques précisions :",
    statement: "Dans votre équipe, l'orthographe est-elle un sujet ?",
    choices: [
      { key: "A", text: "Oui, un vrai enjeu opérationnel" },
      { key: "B", text: "Parfois, sur certains documents" },
      { key: "C", text: "Pas vraiment" },
      { key: "D", text: "Je ne sais pas" },
    ],
  },
  {
    id: "d2",
    type: "declarative",
    category: "Votre rôle",
    prompt: "Quelques précisions :",
    statement: "Êtes-vous impliqué(e) dans la formation de vos équipes ?",
    choices: [
      { key: "A", text: "Oui, c'est mon rôle principal" },
      { key: "B", text: "Partiellement, parmi d'autres missions" },
      { key: "C", text: "Non, ce n'est pas mon périmètre" },
      { key: "D", text: "Je ne sais pas" },
    ],
  },
  {
    id: "d3",
    type: "declarative",
    category: "Votre intérêt",
    prompt: "Une dernière chose :",
    statement: "Seriez-vous intéressé(e) par un diagnostic complet pour votre équipe ?",
    choices: [
      { key: "A", text: "Oui, je veux en savoir plus" },
      { key: "B", text: "Peut-être, à creuser plus tard" },
      { key: "C", text: "Non, pas pour le moment" },
      { key: "D", text: "Je préfère ne pas répondre" },
    ],
  },
];

export const ALL_QUESTIONS: Question[] = [
  ...PROCEDURAL_QUESTIONS,
  ...DECLARATIVE_QUESTIONS,
];

export const TOTAL_QUESTIONS = ALL_QUESTIONS.length; // 13

// Durée totale du test en secondes
export const TEST_DURATION_SECONDS = 5 * 60; // 5 minutes

// Durée par question (utilisée pour le timer ring visuel)
export const PER_QUESTION_SECONDS = Math.floor(TEST_DURATION_SECONDS / TOTAL_QUESTIONS);
