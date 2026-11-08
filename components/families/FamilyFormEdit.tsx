"use client";

import { toast } from "sonner";
import { DataLoadErrorState } from "@/components/shared/error-state";
import { FormSkeleton } from "@/components/shared/form-skeleton";
import { useRouter, useTranslations, useFamily, useFamilyForm, useUpdateFamily } from "@/hooks";
import { FamilyForm } from "./FamilyForm";
import { FamilyMembersCard } from "./FamilyMembersCard";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { Family } from "@/lib/types/familyApiTypes";
import type { FamilyFormData } from "@/lib/zod/schemas/familyFormSchema";

type FamilyFormEditProps = { familyId: string };

export function FamilyFormEdit({ familyId }: FamilyFormEditProps) {
  const { family, isLoading, isError } = useFamily(familyId);

  if (isLoading) return <FormSkeleton fields={2} columns={2} />;
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
      await updateFamily({ id: family.id, data: { name: data.name, address: data.address || null } });
      router.push(paths.families.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
        <FamilyForm
          control={control}
          isSubmitting={isUpdating}
          onCancel={() => router.push(paths.families.list)}
        />
      </form>
      <FamilyMembersCard familyId={family.id} />
    </div>
  );
}
