"use client";

import type { Control } from "react-hook-form";
import { useTranslations, useMembers } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import type { MinistryFormData } from "@/lib/zod/schemas/ministryFormSchema";

type MinistryFormProps = {
  control: Control<MinistryFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function MinistryForm({ control, onCancel, isSubmitting }: MinistryFormProps) {
  const t = useTranslations("ministerios");
  const { members } = useMembers({ limit: 100 });

  const leaderOptions = [
    { value: "none", label: t("semLider") },
    ...members.map((member) => ({ value: member.id, label: member.fullName })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <FormSection title={t("titulo")}>
        <FormGrid columns={2}>
          <FormField control={control} name="name" label={t("name")} />
          <FormField
            control={control}
            name="leaderId"
            label={t("leader")}
            type="select"
            options={leaderOptions}
          />
        </FormGrid>
        <FormField control={control} name="description" label={t("description")} type="textarea" />
      </FormSection>
      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </div>
  );
}
