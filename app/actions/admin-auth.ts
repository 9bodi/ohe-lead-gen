"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginAdmin(password: string): Promise<LoginResult> {
  if (!password) {
    return { ok: false, error: "Mot de passe requis" };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error("ADMIN_PASSWORD_HASH not defined in .env");
    return { ok: false, error: "Configuration invalide" };
  }

  const match = await bcrypt.compare(password, hash);
  if (!match) {
    return { ok: false, error: "Mot de passe incorrect" };
  }

  await createSession();
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
