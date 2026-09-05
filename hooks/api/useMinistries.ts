import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type { MinistryListParams, MinistryUpdateInput } from "@/lib/types/ministryApiTypes";

export const ministryKeys = {
  all: ["ministries"] as const,
  list: (params?: MinistryListParams) => [...ministryKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...ministryKeys.all, "detail", id] as const,
};

export function useMinistries(params: MinistryListParams = {}) {
  const query = useQuery({
    queryKey: ministryKeys.list(params),
    queryFn: () => endpoints.listMinistries(params),
  });

  return {
    ministries: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useMinistry(id: string) {
  const query = useQuery({
    queryKey: ministryKeys.detail(id),
    queryFn: () => endpoints.getMinistry(id),
    enabled: !!id,
  });

  return { ministry: query.data, isLoading: query.isLoading, isError: query.isError };
}

export function useCreateMinistry() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.createMinistry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ministryKeys.all }),
  });

  return { createMinistry: mutation.mutateAsync, isCreating: mutation.isPending };
}

export function useUpdateMinistry() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MinistryUpdateInput }) =>
      endpoints.updateMinistry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ministryKeys.all }),
  });

  return { updateMinistry: mutation.mutateAsync, isUpdating: mutation.isPending };
}

export function useDeleteMinistry() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.deleteMinistry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ministryKeys.all }),
  });

  return { deleteMinistry: mutation.mutateAsync, isDeleting: mutation.isPending };
}
