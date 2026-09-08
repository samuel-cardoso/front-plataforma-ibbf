import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "@/hooks/i18n";
import { paths } from "@/lib/utils/paths";

export default async function LegalLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("comum");

  return (
    <div className="flex min-h-svh flex-1 justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <img src="/logo-igreja.png" alt="Plataforma IBBF" className="h-14 w-auto" />
          <Link
            href={paths.login}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {t("voltar")}
          </Link>
        </div>
        <div className="rounded-xl bg-card p-8 text-card-foreground ring-1 ring-foreground/10 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
