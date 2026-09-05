import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import { usePermissionStore } from "@/stores/permissionStore";
import { sessionKeys } from "./useSession";

export function useRegister() {
  const queryClient = useQueryClient();
  const resetPermissions = usePermissionStore((state) => state.reset);

  const mutation = useMutation({
    mutationFn: endpoints.register,
    onSuccess: (user) => {
      resetPermissions();
      queryClient.setQueryData(sessionKeys.all, user);
    },
  });

  return {
    register: mutation.mutateAsync,
    isRegistering: mutation.isPending,
    error: mutation.error,
  };
}
