"use client";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DataLoadErrorState } from "@/components/shared/error-state";
import { useRouter, useTranslations, useMember, useMemberForm, useUpdateMember } from "@/hooks";
import { MemberForm } from "./MemberForm";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { Member, MemberStatus, MemberType, MemberUpdateInput } from "@/lib/types/memberApiTypes";
import type { MemberFormData } from "@/lib/zod/schemas/memberFormSchema";

type MemberFormEditProps = { memberId: string };

export function MemberFormEdit({ memberId }: MemberFormEditProps) {
  const { member, isLoading, isError } = useMember(memberId);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !member) return <DataLoadErrorState />;

  return <MemberEditFormContent member={member} />;
}

function MemberEditFormContent({ member }: { member: Member }) {
  const router = useRouter();
  const tValidation = useTranslations("validacao");
  const { updateMember, isUpdating } = useUpdateMember();
  const { control, handleSubmit } = useMemberForm(tValidation, member);

  const onSubmit = async (data: MemberFormData) => {
    const payload: MemberUpdateInput = {
      fullName: data.fullName,
      cpf: data.cpf || null,
      birthDate: data.birthDate,
      phone: data.phone || null,
      address: data.address || null,
      memberType: data.memberType as MemberType,
      memberStatus: data.memberStatus as MemberStatus,
      joinedAt: data.joinedAt || undefined,
      baptized: data.baptized,
      familyId: data.familyId && data.familyId !== "none" ? data.familyId : null,
    };

    try {
      await updateMember({ id: member.id, data: payload });
      router.push(paths.members.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
      <MemberForm
        control={control}
        isSubmitting={isUpdating}
        onCancel={() => router.push(paths.members.list)}
      />
    </form>
  );
}
