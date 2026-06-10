// Schéma de validation du formulaire de capture lead (version freemium)
// CDC section 4.1 : email obligatoire + opt-in marketing facultatif

import { z } from "zod";
import { isDisposableEmail } from "@/lib/email-blocklist";

// === Formulaire de capture (côté client) ===

export const leadFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Votre email est requis")
    .email("Format email invalide")
    .max(200, "Email trop long")
    .refine(
      (email) => !isDisposableEmail(email),
      "Merci d'utiliser un email valide (les adresses jetables ne sont pas acceptées)"
    ),

  firstName: z.string().trim().max(80, "Prénom trop long").optional().or(z.literal("")),
  lastName: z.string().trim().max(80, "Nom trop long").optional().or(z.literal("")),
  organization: z.string().trim().max(150, "Nom d'organisation trop long").optional().or(z.literal("")),

  marketingOptIn: z.boolean(),
});


export type LeadFormInput = z.infer<typeof leadFormSchema>;

// === Payload du test (depuis sessionStorage) ===

export const rawAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string().nullable(), // texte du choix ou "yes"/"no" pour déclaratives
  isCorrect: z.boolean().nullable(),
  answeredInMs: z.number(),
});

export const testPayloadSchema = z.object({
  answers: z.array(rawAnswerSchema),
  durationMs: z.number(),
  /** Source UTM optionnelle (depuis les query params à l'arrivée sur le site) */
  utm: z
    .object({
      source: z.string().optional().nullable(),
      campaign: z.string().optional().nullable(),
      medium: z.string().optional().nullable(),
    })
    .optional(),
});

export type TestPayload = z.infer<typeof testPayloadSchema>;

// === Schéma server action ===

export const submitLeadSchema = leadFormSchema.extend({
  testPayload: testPayloadSchema,
});

export type SubmitLeadInput = z.infer<typeof submitLeadSchema>;
