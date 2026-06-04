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
  marketingOptIn: false,
};

export default function CapturePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<LeadFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormInput, string>>>({});

  const [testPayload, setTestPayload] = useState<TestPayload | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Récupérer le payload du test depuis sessionStorage
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

  // Si pas de test fait → redirection accueil
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

    // Validation Zod côté client
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

    // Récupérer les UTM depuis l'URL si présents
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

      // Succès : nettoyer sessionStorage et passer à l'écran de chargement
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
      <div className="flex items-baseline justify-between px-14 py-6 border-b border-ohe-line">
        <Logo size={32} withLabel />
        <div className="text-xs text-ohe-muted">
          <span className="ohe-eyebrow text-ohe-accent">Étape finale</span>
        </div>
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center px-14 py-12">
        <div className="w-full max-w-[560px]">
          <div className="ohe-eyebrow text-ohe-accent inline-flex items-center gap-3">
            <span className="opacity-65">✱</span>
            <span>V O T R E &nbsp; R É S U L T A T &nbsp; E S T &nbsp; P R Ê T</span>
          </div>

          <h1 className="mt-6 text-[52px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Où souhaitez-vous{" "}
            <span className="font-serif italic text-ohe-accent">
              le recevoir
            </span>{" "}
            ?
          </h1>

          <p className="mt-5 text-base text-ohe-muted text-pretty max-w-[460px]">
            Saisissez votre email pour découvrir votre score détaillé.
            Vous le recevrez également par email.
          </p>

          {/* Form */}
          <div className="mt-9 bg-ohe-panel-tint border border-ohe-line rounded-2xl px-8 py-8 space-y-6">
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
                autoFocus
              />
            </div>

            {/* Mention RGPD */}
            <div className="text-[12px] text-ohe-muted leading-[1.55] pt-2 border-t border-ohe-line-soft">
              Votre email est utilisé uniquement pour vous envoyer votre
              résultat. Aucun démarchage sans votre accord.
            </div>

            {/* Opt-in marketing */}
            <Checkbox
              checked={form.marketingOptIn}
              onChange={(checked) => updateField("marketingOptIn", checked)}
              disabled={isPending}
            >
              J&apos;accepte de recevoir des informations sur les formations{" "}
              <span className="text-ohe-ink">OHé</span> (facultatif).
            </Checkbox>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                disabled={isPending}
                className="text-sm text-ohe-muted underline underline-offset-4 hover:text-ohe-ink transition-colors disabled:opacity-50"
              >
                ← Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className={`
                  inline-flex items-center gap-3 px-6 py-3.5 rounded-full
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
