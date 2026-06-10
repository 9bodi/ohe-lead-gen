"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FieldLabel, FieldInput, Checkbox, Logo } from "@/components/ui";
import { leadFormSchema, type LeadFormInput } from "@/lib/schemas/lead";
import { submitLead } from "@/app/actions/submit-lead";

type TestPayload = {
  answers: Array<{
    questionId: string;
    answer: string | null;
    isCorrect: boolean | null;
    answeredInMs: number;
  }>;
  durationMs: number;
};

const INITIAL_FORM: LeadFormInput = {
  email: "",
  firstName: "",
  lastName: "",
  organization: "",
  marketingOptIn: false,
};

export default function CapturePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<LeadFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormInput, string>>>({});

  const [testPayload, setTestPayload] = useState<TestPayload | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("test:payload");
    if (raw) {
      try {
        setTestPayload(JSON.parse(raw));
      } catch {
        setTestPayload(null);
      }
    }
    setHasCheckedStorage(true);
  }, []);

  useEffect(() => {
    if (hasCheckedStorage && !testPayload) {
      toast.error("Veuillez d'abord passer le test.");
      router.push("/");
    }
  }, [hasCheckedStorage, testPayload, router]);

  function updateField<K extends keyof LeadFormInput>(
    key: K,
    value: LeadFormInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit() {
    if (!testPayload) return;

    const result = leadFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LeadFormInput, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LeadFormInput;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error("Merci de vérifier votre email.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get("utm_source") || null,
      campaign: params.get("utm_campaign") || null,
      medium: params.get("utm_medium") || null,
    };

    startTransition(async () => {
      const response = await submitLead({
        ...result.data,
        testPayload: { ...testPayload, utm },
      });

      if (!response.ok) {
        if (response.fieldErrors) {
          setErrors(response.fieldErrors as Partial<Record<keyof LeadFormInput, string>>);
        }
        toast.error(response.error);
        return;
      }

      sessionStorage.removeItem("test:payload");
      router.push(`/test/loading?id=${response.resultId}`);
    });
  }

  if (!hasCheckedStorage || !testPayload) {
    return (
      <main className="min-h-screen grid place-items-center bg-ohe-bg">
        <div className="text-ohe-muted text-sm">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink flex flex-col">
      {/* Header */}
      <div className="flex items-baseline justify-between px-6 py-5 sm:px-10 lg:px-14 lg:py-6 border-b border-ohe-line">
        <Logo size={32} withLabel />
        <div className="text-xs text-ohe-muted">
          <span className="ohe-eyebrow text-ohe-accent">Étape finale</span>
        </div>
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
        <div className="w-full max-w-[560px]">
          {/* Premier titre */}
          <div className="text-ohe-accent flex items-center gap-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] sm:tracking-[0.32em]">
            <span className="opacity-65"></span>
            <span>Félicitations</span>
          </div>

          {/* Grand titre */}
          <h1 className="mt-6 text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.07] lg:leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Votre résultat est{" "}
            <span className="font-serif italic text-ohe-accent">prêt</span>
          </h1>

          <p className="mt-5 text-base text-ohe-muted text-pretty max-w-[460px]">
            Saisissez votre email pour découvrir votre score détaillé.
            Vous le recevrez également par email.
          </p>

          {/* Form */}
          <div className="mt-8 lg:mt-9 bg-ohe-panel-tint border border-ohe-line rounded-2xl px-5 py-6 sm:px-8 sm:py-8 space-y-6">
            {/* Prénom + Nom (facultatifs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="firstName">Prénom (facultatif)</FieldLabel>
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
                <FieldLabel htmlFor="lastName">Nom (facultatif)</FieldLabel>
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

            {/* Organisation (facultatif) */}
            <div>
              <FieldLabel htmlFor="organization">Organisation (facultatif)</FieldLabel>
              <FieldInput
                id="organization"
                value={form.organization}
                onChange={(e) => updateField("organization", e.target.value)}
                placeholder="Nom de votre structure"
                error={errors.organization}
                disabled={isPending}
                autoComplete="organization"
              />
            </div>

            {/* Email (obligatoire) */}
            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldInput
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="marie.dubois@exemple.fr"
                error={errors.email}
                disabled={isPending}
                autoComplete="email"
              />
            </div>

            {/* Opt-in marketing */}
            <Checkbox
              checked={form.marketingOptIn}
              onChange={(checked) => updateField("marketingOptIn", checked)}
              disabled={isPending}
            >
              J&apos;accepte de recevoir des informations de la part d&apos;
              <span className="text-ohe-ink">OHé Orthographe</span>.
            </Checkbox>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                disabled={isPending}
                className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors disabled:opacity-50 text-center sm:text-left"
              >
                ← Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className={`
                  inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-full
                  text-sm font-medium tracking-[0.01em]
                  bg-ohe-accent text-ohe-accent-ink border border-transparent
                  hover:bg-ohe-ink transition-colors cursor-pointer
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {isPending ? "Envoi..." : "Voir mon résultat"}
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
