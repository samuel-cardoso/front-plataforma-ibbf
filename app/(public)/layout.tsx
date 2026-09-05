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
    <div className="flex flex-1 items-center justify-center bg-muted/30 p-6">{children}</div>
  );
}
