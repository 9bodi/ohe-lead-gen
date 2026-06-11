"use server";

import { prisma } from "@/lib/prisma";
import { contactFormSchema, type ContactFormInput } from "@/lib/schemas/contact";
import { sendContactNotification } from "@/lib/email/send";


export type SubmitContactResult =
  | { ok: true; contactId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitContact(
  input: ContactFormInput
): Promise<SubmitContactResult> {
  // Validation Zod
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Formulaire invalide",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Création en DB
  try {
    const contact = await prisma.contactRequest.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company,
        jobTitle: data.jobTitle || null,
        teamSize: data.teamSize || null,
        message: data.message || null,
        freemiumResultId: data.freemiumResultId || null,
      },
    });
    // Notification email vers la boîte contact — non bloquant.
    // Si l'envoi échoue, la demande reste enregistrée en base.
    sendContactNotification({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      company: data.company,
      jobTitle: data.jobTitle || null,
      teamSize: data.teamSize || null,
      message: data.message || null,
      contactId: contact.id,
      freemiumResultId: data.freemiumResultId || null,
        }).catch((e: unknown) => {

      console.error("submitContact — notification email failed:", e);
    });


    return { ok: true, contactId: contact.id };
  } catch (e) {
    console.error("submitContact — db error:", e);
    return {
      ok: false,
      error: "Une erreur est survenue. Merci de réessayer.",
    };
  }
}
