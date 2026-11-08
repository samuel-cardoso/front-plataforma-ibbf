/** Formata centavos como moeda brasileira no idioma ativo (a moeda é sempre BRL). */
export function formatCents(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(cents / 100);
}

/**
 * Máscara de valor para digitação: trata tudo como centavos ("1234" → "12,34"),
 * o padrão de caixa registradora que evita ambiguidade entre vírgula e ponto.
 */
export function maskMoney(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 11);
  if (!digits) return "";
  const cents = digits.padStart(3, "0");
  const integer = cents.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${integer},${cents.slice(-2)}`;
}

/** Converte o texto mascarado ("1.234,56") em centavos inteiros (123456). */
export function parseMoneyToCents(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}
