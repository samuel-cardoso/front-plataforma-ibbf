import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type {
  ParticipationCreateInput,
  ParticipationListParams,
  ParticipationUpdateInput,
} from "@/lib/types/ministryApiTypes";

export const ministryMemberKeys = {
  all: (ministryId: string) => ["ministryMembers", ministryId] as const,
  list: (ministryId: string, params?: ParticipationListParams) =>
    [...ministryMemberKeys.all(ministryId), "list", params ?? {}] as const,
};

export function useMinistryMembers(ministryId: string, params: ParticipationListParams = {}) {
  const query = useQuery({
    queryKey: ministryMemberKeys.list(ministryId, params),
    queryFn: () => endpoints.listMinistryParticipations(ministryId, params),
    enabled: !!ministryId,
  });

  return {
    participations: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useAddMinistryMember(ministryId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ParticipationCreateInput) => endpoints.addMinistryParticipation(ministryId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ministryMemberKeys.all(ministryId) }),
  });

  return { addMember: mutation.mutateAsync, isAdding: mutation.isPending };
}

export function useUpdateMinistryMemberRole(ministryId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: ParticipationUpdateInput }) =>
      endpoints.updateMinistryParticipationRole(ministryId, memberId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ministryMemberKeys.all(ministryId) }),
  });

  return { updateRole: mutation.mutateAsync, isUpdatingRole: mutation.isPending };
}

export function useRemoveMinistryMember(ministryId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (memberId: string) => endpoints.removeMinistryParticipation(ministryId, memberId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ministryMemberKeys.all(ministryId) }),
  });

  return { removeMember: mutation.mutateAsync, isRemoving: mutation.isPending };
}
