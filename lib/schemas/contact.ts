import { z } from "zod";
import { isDisposableEmail } from "@/lib/email-blocklist";

// Tailles d'équipe — valeurs prédéfinies pour faciliter le tri côté backoffice
export const TEAM_SIZE_OPTIONS = [
  { value: "1-10", label: "1 à 10 personnes" },
  { value: "11-50", label: "11 à 50 personnes" },
  { value: "51-200", label: "51 à 200 personnes" },
  { value: "201-500", label: "201 à 500 personnes" },
  { value: "500+", label: "Plus de 500 personnes" },
] as const;

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Votre prénom est requis")
    .max(80, "Prénom trop long"),

  lastName: z
    .string()
    .trim()
    .min(1, "Votre nom est requis")
    .max(80, "Nom trop long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Votre email est requis")
    .email("Format email invalide")
    .max(200, "Email trop long")
    .refine(
      (email) => !isDisposableEmail(email),
      "Merci d'utiliser un email professionnel"
    ),

  company: z
    .string()
    .trim()
    .min(1, "Le nom de votre structure est requis")
    .max(150, "Nom de structure trop long"),

  jobTitle: z
    .string()
    .trim()
    .max(120, "Intitulé trop long")
    .optional()
    .or(z.literal("")),

  teamSize: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .max(500, "Message trop long (500 caractères maximum)")
    .optional()
    .or(z.literal("")),

  // ID de la session freemium si le contact vient juste de passer le test
  freemiumResultId: z.string().optional().or(z.literal("")),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
