import en from "./locales/en.json";
import pt from "./locales/pt.json";

export type Language = "en" | "pt";

const locales: Record<Language, Record<string, string>> = { en, pt };

export function t(key: string, lang?: Language): string {
  const value = lang ? locales[lang]?.[key] : undefined;
  return value ?? locales["en"]?.[key] ?? key;
}
