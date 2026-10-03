"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { FamilyFormData } from "@/lib/zod/schemas/familyFormSchema";

type FamilyFormProps = {
  control: Control<FamilyFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function FamilyForm({ control, onCancel, isSubmitting }: FamilyFormProps) {
  const t = useTranslations("familias");

  return (
    <Card>
      <CardContent>
        <FormSection>
          <FormGrid columns={1}>
            <FormField
              control={control}
              name="name"
              label={t("name")}
              placeholder={t("namePlaceholder")}
            />
          </FormGrid>
        </FormSection>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </CardFooter>
    </Card>
  );
}
