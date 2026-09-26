"use client";

import type { Control } from "react-hook-form";
import { useTranslations, useMembers } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import { Skeleton } from "@/components/ui/skeleton";
import type { MinistryFormData } from "@/lib/zod/schemas/ministryFormSchema";

type MinistryFormProps = {
  control: Control<MinistryFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function MinistryForm({ control, onCancel, isSubmitting }: MinistryFormProps) {
  const t = useTranslations("ministerios");
  const { members, isLoading: isLoadingMembers } = useMembers({ limit: 100 });

  const leaderOptions = [
    { value: "none", label: t("semLider") },
    ...members.map((member) => ({ value: member.id, label: member.fullName })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <FormSection>
        <FormGrid columns={2}>
          <FormField control={control} name="name" label={t("name")} />
          {isLoadingMembers ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <FormField
              control={control}
              name="leaderId"
              label={t("leader")}
              type="select"
              options={leaderOptions}
            />
          )}
        </FormGrid>
        <FormField control={control} name="description" label={t("description")} type="textarea" />
      </FormSection>
      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </div>
  );
}
