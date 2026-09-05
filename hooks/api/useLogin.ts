import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import { usePermissionStore } from "@/stores/permissionStore";
import { sessionKeys } from "./useSession";

export function useLogin() {
  const queryClient = useQueryClient();
  const resetPermissions = usePermissionStore((state) => state.reset);

  const mutation = useMutation({
    mutationFn: endpoints.login,
    onSuccess: (user) => {
      resetPermissions();
      queryClient.setQueryData(sessionKeys.all, user);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoggingIn: mutation.isPending,
    error: mutation.error,
  };
}
