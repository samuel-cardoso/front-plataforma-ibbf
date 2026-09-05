"use client";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DataLoadErrorState } from "@/components/shared/error-state";
import { useRouter, useTranslations, useMinistry, useMinistryForm, useUpdateMinistry } from "@/hooks";
import { MinistryForm } from "./MinistryForm";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { Ministry, MinistryUpdateInput } from "@/lib/types/ministryApiTypes";
import type { MinistryFormData } from "@/lib/zod/schemas/ministryFormSchema";

type MinistryFormEditProps = { ministryId: string };

export function MinistryFormEdit({ ministryId }: MinistryFormEditProps) {
  const { ministry, isLoading, isError } = useMinistry(ministryId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !ministry) return <DataLoadErrorState />;

  return <MinistryEditFormContent ministry={ministry} />;
}

function MinistryEditFormContent({ ministry }: { ministry: Ministry }) {
  const router = useRouter();
  const tValidation = useTranslations("validacao");
  const { updateMinistry, isUpdating } = useUpdateMinistry();
  const { control, handleSubmit } = useMinistryForm(tValidation, ministry);

  const onSubmit = async (data: MinistryFormData) => {
    const payload: MinistryUpdateInput = {
      name: data.name,
      leaderId: data.leaderId && data.leaderId !== "none" ? data.leaderId : null,
      description: data.description || null,
    };

    try {
      await updateMinistry({ id: ministry.id, data: payload });
      router.push(paths.ministries.list);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
      <MinistryForm
        control={control}
        isSubmitting={isUpdating}
        onCancel={() => router.push(paths.ministries.list)}
      />
    </form>
  );
}
