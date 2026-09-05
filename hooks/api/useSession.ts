import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";

export const sessionKeys = {
  all: ["session"] as const,
};

export function useSession() {
  const query = useQuery({
    queryKey: sessionKeys.all,
    queryFn: endpoints.getSession,
    retry: false,
    staleTime: 5 * 60_000,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !query.isError && !!query.data,
  };
}
