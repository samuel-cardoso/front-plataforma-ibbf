import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: endpoints.forgotPassword,
  });

  return {
    forgotPassword: mutation.mutateAsync,
    isSendingForgotPassword: mutation.isPending,
    error: mutation.error,
  };
}
