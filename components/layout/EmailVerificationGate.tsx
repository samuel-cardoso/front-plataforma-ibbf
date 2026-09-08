"use client";

import { useEffect, useRouter, useSession, type ReactNode } from "@/hooks";
import { paths } from "@/lib/utils/paths";

/**
 * Bloqueia o acesso à área autenticada quando sabemos com certeza que o e-mail
 * ainda não foi verificado (`emailVerifiedAt === null`, vindo fresco da resposta
 * de login/registro/verificação nesta sessão do navegador).
 *
 * Isso NÃO é um controle de segurança real: a API não exige e-mail verificado
 * para nada, e a sessão só é reidratada por decode do JWT num reload de página
 * (sem `emailVerifiedAt`), então esse gate não pega um usuário que já está
 * dentro do app e dá F5. É só a barreira de UX pedida — para fechar esse
 * buraco de vez, o back precisaria incluir `emailVerifiedAt` como claim no JWT.
 */
export function EmailVerificationGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const isKnownUnverified = user?.emailVerifiedAt === null;

  useEffect(() => {
    if (isKnownUnverified && user) {
      router.replace(`${paths.confirmEmail}?email=${encodeURIComponent(user.email)}`);
    }
  }, [isKnownUnverified, user, router]);

  if (isLoading || isKnownUnverified) {
    return null;
  }

  return <>{children}</>;
}
