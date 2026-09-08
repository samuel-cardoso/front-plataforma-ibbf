import type { ReactNode } from "react";
import { paths } from "@/lib/utils/paths";

/**
 * Layout sem checagem de sessão: diferente de `(public)` e `(app)`, estas páginas
 * funcionam tanto logado quanto deslogado (ex.: confirmar e-mail a partir de um
 * link aberto num dispositivo onde o usuário não está autenticado).
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href={paths.home} className="self-center">
          <img src="/logo-igreja.png" alt="Plataforma IBBF" className="h-24 w-auto" />
        </a>
        {children}
      </div>
    </div>
  );
}
