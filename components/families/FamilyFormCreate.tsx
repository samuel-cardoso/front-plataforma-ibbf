"use client";

import { toast } from "sonner";
import { useRouter, useTranslations, useFamilyForm, useCreateFamily } from "@/hooks";
import { FamilyForm } from "./FamilyForm";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { FamilyFormData } from "@/lib/zod/schemas/familyFormSchema";

export function FamilyFormCreate() {
  const router = useRouter();
  const tValidation = useTranslations("validacao");
  const { createFamily, isCreating } = useCreateFamily();
  const { control, handleSubmit } = useFamilyForm(tValidation);

  const onSubmit = async (data: FamilyFormData) => {
    try {
      await createFamily(data);
      router.push(paths.families.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
      <FamilyForm
        control={control}
        isSubmitting={isCreating}
        onCancel={() => router.push(paths.families.list)}
      />
    </form>
  );
}
