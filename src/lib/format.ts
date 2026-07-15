export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Usuwa wiodące "powiat " z nazwy, np. "powiat Wrocław" -> "Wrocław". */
export function bareName(nazwa: string): string {
  return nazwa.replace(/^powiat\s+/i, "");
}
