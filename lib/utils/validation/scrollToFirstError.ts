import type { FieldErrors } from "react-hook-form";

/** Rola a tela até o primeiro campo inválido do formulário no submit. Campos marcam `data-field-name`. */
export function scrollToFirstError(errors: FieldErrors) {
  const firstErrorName = Object.keys(errors)[0];
  if (!firstErrorName) return;

  const el = document.querySelector(`[data-field-name="${firstErrorName}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}
