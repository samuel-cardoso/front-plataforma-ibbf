import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type { SessionUser } from "@/lib/types/authTypes";
import { sessionKeys } from "./useSession";

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: endpoints.verifyEmail,
    onSuccess: () => {
      queryClient.setQueryData<SessionUser>(sessionKeys.all, (current) =>
        current ? { ...current, emailVerifiedAt: new Date().toISOString() } : current
      );
    },
  });

  return {
    verifyEmail: mutation.mutateAsync,
    isVerifyingEmail: mutation.isPending,
    error: mutation.error,
  };
}
