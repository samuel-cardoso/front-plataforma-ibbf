"use client";

import type { Control } from "react-hook-form";
import { useTranslations, useMembers } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card>
      <CardContent>
        <FormSection>
          <FormGrid columns={2}>
            <FormField
              control={control}
              name="name"
              label={t("name")}
              placeholder={t("namePlaceholder")}
            />
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
                placeholder={t("leaderPlaceholder")}
              />
            )}
          </FormGrid>
          <FormField
            control={control}
            name="description"
            label={t("description")}
            type="textarea"
            placeholder={t("descriptionPlaceholder")}
          />
        </FormSection>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </CardFooter>
    </Card>
  );
}
