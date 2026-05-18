"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui";

interface StartTestButtonProps {
  slug: string;
}

export function StartTestButton({ slug }: StartTestButtonProps) {
  const router = useRouter();

  return (
    <PrimaryButton onClick={() => router.push(`/${slug}/test`)}>
      Démarrer la démo
    </PrimaryButton>
  );
}
