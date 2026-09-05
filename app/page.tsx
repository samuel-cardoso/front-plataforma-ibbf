import { redirect } from "next/navigation";
import { getAccessToken } from "@/infra/api/config/cookies";
import { paths } from "@/lib/utils/paths";

export default async function Home() {
  const accessToken = await getAccessToken();
  redirect(accessToken ? paths.home : paths.login);
}
