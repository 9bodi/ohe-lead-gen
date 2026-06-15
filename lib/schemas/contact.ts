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

// Profils B2C (waitlist diagnostic personnel)
export const PROFILE_OPTIONS = [
  { value: "salarie", label: "Salarié(e)" },
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "demandeur_emploi", label: "En recherche d'emploi" },
  { value: "independant", label: "Indépendant(e)" },
  { value: "autre", label: "Autre" },
] as const;

export const contactFormSchema = z
  .object({
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
        "Merci d'utiliser un email valide"
      ),

    phone: z
      .string()
      .trim()
      .max(30, "Numéro trop long")
      .refine(
        (val) => val === "" || /\d{6,}/.test(val.replace(/\D/g, "")),
        "Numéro de téléphone invalide"
      )
      .optional()
      .or(z.literal("")),

    company: z
      .string()
      .trim()
      .max(150, "Nom de structure trop long")
      .optional()
      .or(z.literal("")),

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

    // Profil B2C
    profile: z
      .enum(["salarie", "etudiant", "demandeur_emploi", "independant", "autre"])
      .optional()
      .or(z.literal("")),

    // ID de la session freemium si le contact vient juste de passer le test
    freemiumResultId: z.string().optional().or(z.literal("")),

    // Origine de la demande
    requestType: z
      .enum(["btoc", "btob"])
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // En B2B : phone + company obligatoires
    if (data.requestType === "btob") {
      if (!data.phone || data.phone.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Le téléphone est requis pour une demande entreprise",
        });
      }
      if (!data.company || data.company.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["company"],
          message: "Le nom de votre structure est requis",
        });
      }
    }
   
  });

export type ContactFormInput = z.infer<typeof contactFormSchema>;