"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import type { FamilyFormData } from "@/lib/zod/schemas/familyFormSchema";

type FamilyFormProps = {
  control: Control<FamilyFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function FamilyForm({ control, onCancel, isSubmitting }: FamilyFormProps) {
  const t = useTranslations("familias");

  return (
    <div className="flex flex-col gap-6">
      <FormSection title={t("titulo")}>
        <FormGrid columns={1}>
          <FormField control={control} name="name" label={t("name")} />
        </FormGrid>
      </FormSection>
      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </div>
  );
}
