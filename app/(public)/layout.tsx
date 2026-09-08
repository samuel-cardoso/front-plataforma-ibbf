import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/infra/api/config/cookies";
import { paths } from "@/lib/utils/paths";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const accessToken = await getAccessToken();
  if (accessToken) {
    redirect(paths.home);
  }

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
