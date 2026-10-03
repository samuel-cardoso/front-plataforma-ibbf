"use client";

import type { Control } from "react-hook-form";
import { useTranslations, useFamilies } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MEMBER_STATUS_VALUES, MEMBER_TYPE_VALUES } from "@/lib/consts/member";
import type { MemberFormData } from "@/lib/zod/schemas/memberFormSchema";

type MemberFormProps = {
  control: Control<MemberFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function MemberForm({ control, onCancel, isSubmitting }: MemberFormProps) {
  const t = useTranslations("membros");
  const { families, isLoading: isLoadingFamilies } = useFamilies({ limit: 100 });

  const memberTypeOptions = MEMBER_TYPE_VALUES.map((value) => ({
    value,
    label: t(`memberType${value}`),
  }));
  const memberStatusOptions = MEMBER_STATUS_VALUES.map((value) => ({
    value,
    label: t(`memberStatus${value}`),
  }));
  const familyOptions = [
    { value: "none", label: t("semFamilia") },
    ...families.map((family) => ({ value: family.id, label: family.name })),
  ];

  return (
    <Card>
      <CardContent>
        <FormSection>
          <FormGrid columns={2}>
            <FormField
              control={control}
              name="fullName"
              label={t("fullName")}
              placeholder={t("fullNamePlaceholder")}
            />
            <FormField
              control={control}
              name="cpf"
              label={t("cpf")}
              mask="cpf"
              placeholder={t("cpfPlaceholder")}
            />
            <FormField control={control} name="birthDate" label={t("birthDate")} type="date" />
            <FormField
              control={control}
              name="phone"
              label={t("phone")}
              type="tel"
              mask="phone"
              placeholder={t("phonePlaceholder")}
            />
            <FormField
              control={control}
              name="address"
              label={t("address")}
              placeholder={t("addressPlaceholder")}
            />
            <FormField
              control={control}
              name="memberType"
              label={t("memberType")}
              type="select"
              options={memberTypeOptions}
              placeholder={t("memberTypePlaceholder")}
            />
            <FormField
              control={control}
              name="memberStatus"
              label={t("memberStatus")}
              type="select"
              options={memberStatusOptions}
              placeholder={t("memberStatusPlaceholder")}
            />
            <FormField control={control} name="joinedAt" label={t("joinedAt")} type="date" />
            {isLoadingFamilies ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ) : (
              <FormField
                control={control}
                name="familyId"
                label={t("family")}
                type="select"
                options={familyOptions}
                placeholder={t("familyPlaceholder")}
              />
            )}
          </FormGrid>
          <FormField control={control} name="baptized" label={t("baptized")} type="checkbox" />
        </FormSection>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </CardFooter>
    </Card>
  );
}
