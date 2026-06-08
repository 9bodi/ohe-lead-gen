"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Logo,
  FieldLabel,
  FieldInput,
} from "@/components/ui";
import {
  contactFormSchema,
  TEAM_SIZE_OPTIONS,
  type ContactFormInput,
} from "@/lib/schemas/contact";
import { submitContact } from "@/app/actions/submit-contact";

const INITIAL_FORM: ContactFormInput = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  jobTitle: "",
  teamSize: "",
  message: "",
  freemiumResultId: "",
};

function ContactPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromResultId = searchParams.get("from") || "";

  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ContactFormInput>({
    ...INITIAL_FORM,
    freemiumResultId: fromResultId,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactFormInput>(
    key: K,
    value: ContactFormInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit() {
    // Validation locale
    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormInput, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactFormInput;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error("Merci de vérifier les champs en rouge.");
      return;
    }

    startTransition(async () => {
      const response = await submitContact(result.data);

      if (!response.ok) {
        if (response.fieldErrors) {
          setErrors(response.fieldErrors as Partial<Record<keyof ContactFormInput, string>>);
        }
        toast.error(response.error);
        return;
      }

      toast.success("Demande envoyée. Nous revenons vers vous très vite.");
      setSubmitted(true);
    });
  }

  // === Écran de confirmation après envoi ===
  if (submitted) {
    return (
      <main className="min-h-screen bg-ohe-bg text-ohe-ink flex flex-col">
        <div className="border-b border-ohe-line">
          <div className="max-w-[920px] mx-auto px-14 py-7">
            <Logo size={32} withLabel />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-14 py-16">
          <div className="max-w-[560px] text-center">
            <div className="ohe-eyebrow text-ohe-accent mb-6">
              ✱ Demande envoyée
            </div>
            <h1 className="text-[52px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
              Merci !{" "}
              <span className="font-serif italic text-ohe-accent">
                Nous revenons vers vous
              </span>{" "}
              très vite.
            </h1>
            <p className="mt-6 text-base text-ohe-muted text-pretty">
              Un conseiller OHé prendra contact avec vous sous 48h ouvrées pour
              échanger sur votre besoin et vous présenter le diagnostic complet
              adapté à votre équipe.
            </p>
            <div className="mt-10">
              <Link
                href="/"
                className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors"
              >
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // === Formulaire ===
  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink flex flex-col">
      <div className="border-b border-ohe-line">
        <div className="max-w-[920px] mx-auto px-14 py-7 flex items-baseline justify-between">
          <Logo size={32} withLabel />
          <div className="ohe-caption text-ohe-muted">Contact B2B</div>
        </div>
      </div>

      <div className="flex-1 px-14 py-12">
        <div className="max-w-[680px] mx-auto">
          <div className="ohe-eyebrow text-ohe-accent inline-flex items-center gap-3">
            <span className="opacity-65">✱</span>
            <span>D I A G N O S T I C &nbsp; D &apos; É Q U I P E</span>
          </div>

          <h1 className="mt-6 text-[48px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Échangeons sur votre{" "}
            <span className="font-serif italic text-ohe-accent">
              projet de diagnostic
            </span>.
          </h1>

          <p className="mt-5 text-base text-ohe-muted text-pretty max-w-[520px]">
            Un conseiller OHé prendra contact avec vous pour comprendre vos
            besoins, présenter le diagnostic complet sur 6 compétences, et
            définir ensemble le format adapté à votre équipe.
          </p>

          <div className="mt-9 bg-ohe-panel-tint border border-ohe-line rounded-2xl px-8 py-8 space-y-6">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                <FieldInput
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="Marie"
                  error={errors.firstName}
                  disabled={isPending}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                <FieldInput
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Dubois"
                  error={errors.lastName}
                  disabled={isPending}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <FieldLabel htmlFor="email">Email professionnel</FieldLabel>
              <FieldInput
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="marie.dubois@entreprise.fr"
                error={errors.email}
                disabled={isPending}
                autoComplete="email"
              />
            </div>

            {/* Entreprise */}
            <div>
              <FieldLabel htmlFor="company">Entreprise / Structure</FieldLabel>
              <FieldInput
                id="company"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Nom de votre organisation"
                error={errors.company}
                disabled={isPending}
                autoComplete="organization"
              />
            </div>

            {/* Rôle */}
            <div>
              <FieldLabel htmlFor="jobTitle" optional>
                Votre rôle
              </FieldLabel>
              <FieldInput
                id="jobTitle"
                value={form.jobTitle || ""}
                onChange={(e) => updateField("jobTitle", e.target.value)}
                placeholder="Ex. Responsable RH, Directeur Formation"
                error={errors.jobTitle}
                disabled={isPending}
                autoComplete="organization-title"
              />
            </div>

            {/* Taille équipe */}
            <div>
              <FieldLabel htmlFor="teamSize" optional>
                Équipe à diagnostiquer
              </FieldLabel>
              <select
                id="teamSize"
                value={form.teamSize || ""}
                onChange={(e) => updateField("teamSize", e.target.value)}
                disabled={isPending}
                className="w-full px-0 py-2 border-b border-ohe-line bg-transparent text-lg text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors disabled:opacity-50"
              >
                <option value="">Sélectionner...</option>
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <FieldLabel htmlFor="message" optional>
                Votre message
              </FieldLabel>
              <textarea
                id="message"
                value={form.message || ""}
                onChange={(e) => updateField("message", e.target.value)}
                disabled={isPending}
                rows={4}
                maxLength={500}
                placeholder="Précisez votre besoin, vos contraintes, votre échéance..."
                className="w-full px-3 py-2 border border-ohe-line rounded-lg bg-ohe-panel text-base text-ohe-ink focus:outline-none focus:border-ohe-accent transition-colors disabled:opacity-50 resize-none"
              />
              {errors.message && (
                <div className="mt-1.5 text-xs text-red-600">{errors.message}</div>
              )}
              <div className="mt-1 text-[11px] text-ohe-muted text-right">
                {(form.message || "").length} / 500
              </div>
            </div>

            {/* Mention RGPD */}
            <div className="text-[12px] text-ohe-muted leading-[1.55] pt-2 border-t border-ohe-line-soft">
              En envoyant ce formulaire, vous acceptez d&apos;être recontacté(e)
              par l&apos;équipe OHé concernant votre demande. Vos données sont
              traitées dans le respect du RGPD.
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/"
                className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors"
              >
                ← Annuler
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-[0.01em] bg-ohe-accent text-ohe-accent-ink border border-transparent hover:bg-ohe-ink transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Envoi..." : "Envoyer ma demande"}
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ohe-bg" />}>
      <ContactPageContent />
    </Suspense>
  );
}
