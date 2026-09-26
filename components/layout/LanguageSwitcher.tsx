"use client";

import { useLocale, useRouter, useTransition } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { setLocale } from "@/lib/actions/locale";
import type { Locale } from "@/config/i18n";

const LOCALE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "pt-BR", label: "Português", flag: "🇧🇷" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const current = LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0];

  const handleChange = (value: Locale) => {
    startTransition(async () => {
      await setLocale(value);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Alternar idioma"
            disabled={isPending}
          >
            <span className="flex size-4 items-center justify-center text-base leading-none">
              {current.flag}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LOCALE_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => handleChange(option.value)}>
            <span className="flex size-4 items-center justify-center text-base leading-none">
              {option.flag}
            </span>
            <span className="flex-1">{option.label}</span>
            {option.value === locale && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
