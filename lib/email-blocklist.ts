// Liste des domaines email jetables / temporaires
// Source : commune dans l'écosystème, peut être enrichie selon les besoins

export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Mainstream temporary email services
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "mailinator.com",
  "mailinator.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "sharklasers.com",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.net",
  "fakeinbox.com",
  "maildrop.cc",
  "getnada.com",
  "tempinbox.com",
  "mohmal.com",
  "mintemail.com",
  "spambox.us",
  "spam4.me",
  "tempinbox.com",
  "dispostable.com",
  "mailcatch.com",
  "emailondeck.com",
  "anonymbox.com",
  "burnermail.io",
  "33mail.com",
  "tempr.email",
  "discard.email",
  "tmpmail.org",
  "tmpmail.net",
  "tmpeml.info",
  "moakt.com",
]);

/**
 * Vérifie si un email utilise un domaine jetable connu.
 */
export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
