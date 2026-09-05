"use client";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DataLoadErrorState } from "@/components/shared/error-state";
import { useRouter, useTranslations, useFamily, useFamilyForm, useUpdateFamily } from "@/hooks";
import { FamilyForm } from "./FamilyForm";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { Family } from "@/lib/types/familyApiTypes";
import type { FamilyFormData } from "@/lib/zod/schemas/familyFormSchema";

type FamilyFormEditProps = { familyId: string };

export function FamilyFormEdit({ familyId }: FamilyFormEditProps) {
  const { family, isLoading, isError } = useFamily(familyId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !family) return <DataLoadErrorState />;

  return <FamilyEditFormContent family={family} />;
}

function FamilyEditFormContent({ family }: { family: Family }) {
  const router = useRouter();
  const tValidation = useTranslations("validacao");
  const { updateFamily, isUpdating } = useUpdateFamily();
  const { control, handleSubmit } = useFamilyForm(tValidation, family);

  const onSubmit = async (data: FamilyFormData) => {
    try {
      await updateFamily({ id: family.id, data });
      router.push(paths.families.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
      <FamilyForm
        control={control}
        isSubmitting={isUpdating}
        onCancel={() => router.push(paths.families.list)}
      />
    </form>
  );
}
