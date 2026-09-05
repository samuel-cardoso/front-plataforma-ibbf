import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type { MemberListParams, MemberUpdateInput } from "@/lib/types/memberApiTypes";

export const memberKeys = {
  all: ["members"] as const,
  list: (params?: MemberListParams) => [...memberKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...memberKeys.all, "detail", id] as const,
};

export function useMembers(params: MemberListParams = {}) {
  const query = useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => endpoints.listMembers(params),
  });

  return {
    members: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useMember(id: string) {
  const query = useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => endpoints.getMember(id),
    enabled: !!id,
  });

  return { member: query.data, isLoading: query.isLoading, isError: query.isError };
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.createMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });

  return { createMember: mutation.mutateAsync, isCreating: mutation.isPending };
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberUpdateInput }) =>
      endpoints.updateMember(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });

  return { updateMember: mutation.mutateAsync, isUpdating: mutation.isPending };
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.deleteMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });

  return { deleteMember: mutation.mutateAsync, isDeleting: mutation.isPending };
}
