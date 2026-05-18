import { Logo } from "./Logo";

interface HeaderProps {
  /** Slot à droite (badge, infos meta, etc.) */
  right?: React.ReactNode;
  /** Couleur du logo */
  logoVariant?: "default" | "accent";
  /** Afficher la hairline du bas */
  hairline?: boolean;
}

export function Header({ right, logoVariant = "accent", hairline = false }: HeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-14 py-6 ${
        hairline ? "border-b border-ohe-line" : ""
      }`}
    >
      <Logo variant={logoVariant} size="sm" />
      {right && <div className="flex items-center gap-6">{right}</div>}
    </div>
  );
}
