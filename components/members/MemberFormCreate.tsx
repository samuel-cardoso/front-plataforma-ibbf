"use client";

import { toast } from "sonner";
import { useRouter, useTranslations, useMemberForm, useCreateMember } from "@/hooks";
import { MemberForm } from "./MemberForm";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { MemberFormData } from "@/lib/zod/schemas/memberFormSchema";
import type { MemberCreateInput, MemberStatus, MemberType } from "@/lib/types/memberApiTypes";

export function MemberFormCreate() {
  const router = useRouter();
  const tValidation = useTranslations("validacao");
  const { createMember, isCreating } = useCreateMember();
  const { control, handleSubmit } = useMemberForm(tValidation);

  const onSubmit = async (data: MemberFormData) => {
    const payload: MemberCreateInput = {
      fullName: data.fullName,
      cpf: data.cpf || undefined,
      birthDate: data.birthDate,
      phone: data.phone || undefined,
      address: data.address || undefined,
      memberType: data.memberType as MemberType,
      memberStatus: data.memberStatus as MemberStatus,
      joinedAt: data.joinedAt || undefined,
      baptized: data.baptized,
      familyId: data.familyId && data.familyId !== "none" ? data.familyId : undefined,
    };

    try {
      await createMember(payload);
      router.push(paths.members.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
      <MemberForm
        control={control}
        isSubmitting={isCreating}
        onCancel={() => router.push(paths.members.list)}
      />
    </form>
  );
}
