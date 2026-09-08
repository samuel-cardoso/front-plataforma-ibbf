import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";

export function useResendVerification() {
  const mutation = useMutation({
    mutationFn: endpoints.resendVerification,
  });

  return {
    resendVerification: mutation.mutateAsync,
    isResendingVerification: mutation.isPending,
    error: mutation.error,
  };
}
