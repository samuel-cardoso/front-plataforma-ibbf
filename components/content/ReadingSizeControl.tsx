"use client";

import { AArrowDown, AArrowUp } from "lucide-react";
import { useState, useEffect, useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ibbf:reading-size";
export const READING_SIZES = ["text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"] as const;
const DEFAULT_SIZE = 1;

/** Tamanho de leitura de letras e versículos, lembrado por navegador (conveniência, não dado). */
export function useReadingSize() {
  const [size, setSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(STORAGE_KEY));
      // localStorage só existe no browser, depois da hidratação.
      if (Number.isInteger(saved) && saved >= 0 && saved < READING_SIZES.length) setSize(saved);
    } catch {
      // storage indisponível (aba anônima, bloqueio): fica o padrão
    }
  }, []);

  const update = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), READING_SIZES.length - 1);
    setSize(clamped);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      // idem acima
    }
  };

  return { size, className: READING_SIZES[size], setSize: update };
}

export function ReadingSizeControl({ size, onChange }: { size: number; onChange: (size: number) => void }) {
  const t = useTranslations("conteudo");
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon-sm" onClick={() => onChange(size - 1)} disabled={size === 0} aria-label={t("diminuirFonte")}>
        <AArrowDown />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(size + 1)}
        disabled={size === READING_SIZES.length - 1}
        aria-label={t("aumentarFonte")}
      >
        <AArrowUp />
      </Button>
    </div>
  );
}
