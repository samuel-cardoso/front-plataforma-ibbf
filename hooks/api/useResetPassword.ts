import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";

export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: endpoints.resetPassword,
  });

  return {
    resetPassword: mutation.mutateAsync,
    isResettingPassword: mutation.isPending,
    error: mutation.error,
  };
}
