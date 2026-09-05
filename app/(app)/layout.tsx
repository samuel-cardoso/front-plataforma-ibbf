import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/infra/api/config/cookies";
import { AuthenticatedLayout } from "@/components/layout";
import { paths } from "@/lib/utils/paths";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect(paths.login);
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
