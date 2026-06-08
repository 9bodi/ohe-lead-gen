"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo, FieldLabel, FieldInput } from "@/components/ui";
import { loginAdmin } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();

  function handleSubmit() {
    if (!password) {
      setError("Mot de passe requis");
      return;
    }

    startTransition(async () => {
      const result = await loginAdmin(password);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Connecté");
      router.push("/admin");
    });
  }

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink flex flex-col">
      <div className="border-b border-ohe-line">
        <div className="max-w-[920px] mx-auto px-14 py-7">
          <Logo size={32} withLabel />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-14 py-12">
        <div className="w-full max-w-[420px]">
          <div className="ohe-eyebrow text-ohe-accent mb-6">
            ✱ Administration
          </div>
          <h1 className="text-[40px] leading-[1.05] tracking-[-0.022em] font-normal text-balance">
            Connexion{" "}
            <span className="font-serif italic text-ohe-accent">admin</span>.
          </h1>

          <div className="mt-8 bg-ohe-panel-tint border border-ohe-line rounded-2xl px-8 py-7 space-y-5">
            <div>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <FieldInput id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(undefined); }} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }} placeholder="Mot de passe partagé" error={error} disabled={isPending} autoComplete="current-password" autoFocus />
            </div>

            <button type="button" onClick={handleSubmit} disabled={isPending} className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium bg-ohe-accent text-ohe-accent-ink hover:bg-ohe-ink transition-colors disabled:opacity-60">
              {isPending ? "Connexion..." : "Se connecter"}
            </button>
          </div>

          <p className="mt-6 text-xs text-ohe-muted text-center">
            Cet espace est réservé à l&apos;équipe OHé.
          </p>
        </div>
      </div>
    </main>
  );
}
