"use client";

import { toast } from "sonner";
import { useRouter, useTranslations, useMinistryForm, useCreateMinistry } from "@/hooks";
import { MinistryForm } from "./MinistryForm";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { MinistryFormData } from "@/lib/zod/schemas/ministryFormSchema";
import type { MinistryCreateInput } from "@/lib/types/ministryApiTypes";

export function MinistryFormCreate() {
  const router = useRouter();
  const tValidation = useTranslations("validacao");
  const { createMinistry, isCreating } = useCreateMinistry();
  const { control, handleSubmit } = useMinistryForm(tValidation);

  const onSubmit = async (data: MinistryFormData) => {
    const payload: MinistryCreateInput = {
      name: data.name,
      leaderId: data.leaderId && data.leaderId !== "none" ? data.leaderId : undefined,
      description: data.description || undefined,
    };

    try {
      await createMinistry(payload);
      router.push(paths.ministries.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
      <MinistryForm
        control={control}
        isSubmitting={isCreating}
        onCancel={() => router.push(paths.ministries.list)}
      />
    </form>
  );
}
