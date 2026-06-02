interface FieldLabelProps {
  children: React.ReactNode;
  /** Indique que le champ est facultatif (affiche "· optionnel" en suffixe) */
  optional?: boolean;
  /** Pour lier le label à l'input via htmlFor */
  htmlFor?: string;
}

export function FieldLabel({ children, optional, htmlFor }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline gap-2 text-ohe-muted mb-2.5 text-[11px] font-medium"
      style={{ letterSpacing: "0.24em", textTransform: "uppercase" }}
    >
      <span>{children}</span>
      {optional && (
        <span
          className="opacity-70"
          style={{ letterSpacing: 0, textTransform: "none" }}
        >
          · optionnel
        </span>
      )}
    </label>
  );
}
