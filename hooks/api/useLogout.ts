import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import { usePermissionStore } from "@/stores/permissionStore";

export function useLogout() {
  const queryClient = useQueryClient();
  const resetPermissions = usePermissionStore((state) => state.reset);

  const mutation = useMutation({
    mutationFn: endpoints.logout,
    onSuccess: () => {
      resetPermissions();
      queryClient.clear();
    },
  });

  return {
    logout: mutation.mutateAsync,
    isLoggingOut: mutation.isPending,
  };
}
