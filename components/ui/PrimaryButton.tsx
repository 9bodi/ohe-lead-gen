import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visuelle */
  variant?: "solid" | "outline";
  /** Icône affichée après le label, défaut → */
  icon?: string | null;
  /** Taille */
  size?: "sm" | "md";
}

export function PrimaryButton({
  children,
  variant = "solid",
  icon = "→",
  size = "md",
  className = "",
  ...props
}: PrimaryButtonProps) {
  const padding = size === "sm" ? "px-[22px] py-[14px]" : "px-[26px] py-[16px]";

  const variantClass =
    variant === "solid"
      ? "bg-ohe-accent text-ohe-accent-ink border border-transparent hover:bg-ohe-ink transition-colors"
      : "bg-transparent text-ohe-accent border border-ohe-accent hover:bg-ohe-accent-soft transition-colors";

  return (
    <button
      className={`inline-flex items-center gap-[14px] rounded-full text-sm font-medium tracking-[0.01em] cursor-pointer ${padding} ${variantClass} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="text-base">{icon}</span>}
    </button>
  );
}
