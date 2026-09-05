import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type { FamilyListParams, FamilyUpdateInput } from "@/lib/types/familyApiTypes";

export const familyKeys = {
  all: ["families"] as const,
  list: (params?: FamilyListParams) => [...familyKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...familyKeys.all, "detail", id] as const,
};

export function useFamilies(params: FamilyListParams = {}) {
  const query = useQuery({
    queryKey: familyKeys.list(params),
    queryFn: () => endpoints.listFamilies(params),
  });

  return {
    families: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useFamily(id: string) {
  const query = useQuery({
    queryKey: familyKeys.detail(id),
    queryFn: () => endpoints.getFamily(id),
    enabled: !!id,
  });

  return { family: query.data, isLoading: query.isLoading, isError: query.isError };
}

export function useCreateFamily() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.createFamily,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyKeys.all }),
  });

  return { createFamily: mutation.mutateAsync, isCreating: mutation.isPending };
}

export function useUpdateFamily() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FamilyUpdateInput }) =>
      endpoints.updateFamily(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyKeys.all }),
  });

  return { updateFamily: mutation.mutateAsync, isUpdating: mutation.isPending };
}

export function useDeleteFamily() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.deleteFamily,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyKeys.all }),
  });

  return { deleteFamily: mutation.mutateAsync, isDeleting: mutation.isPending };
}
