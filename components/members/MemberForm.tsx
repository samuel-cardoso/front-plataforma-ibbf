"use client";

import type { Control } from "react-hook-form";
import { useTranslations, useFamilies } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import { MEMBER_STATUS_VALUES, MEMBER_TYPE_VALUES } from "@/lib/consts/member";
import type { MemberFormData } from "@/lib/zod/schemas/memberFormSchema";

type MemberFormProps = {
  control: Control<MemberFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function MemberForm({ control, onCancel, isSubmitting }: MemberFormProps) {
  const t = useTranslations("membros");
  const { families } = useFamilies({ limit: 100 });

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
    <div className="flex flex-col gap-6">
      <FormSection title={t("titulo")}>
        <FormGrid columns={2}>
          <FormField control={control} name="fullName" label={t("fullName")} />
          <FormField control={control} name="cpf" label={t("cpf")} placeholder="000.000.000-00" />
          <FormField control={control} name="birthDate" label={t("birthDate")} type="date" />
          <FormField control={control} name="phone" label={t("phone")} type="tel" />
          <FormField control={control} name="address" label={t("address")} />
          <FormField
            control={control}
            name="memberType"
            label={t("memberType")}
            type="select"
            options={memberTypeOptions}
          />
          <FormField
            control={control}
            name="memberStatus"
            label={t("memberStatus")}
            type="select"
            options={memberStatusOptions}
          />
          <FormField control={control} name="joinedAt" label={t("joinedAt")} type="date" />
          <FormField
            control={control}
            name="familyId"
            label={t("family")}
            type="select"
            options={familyOptions}
          />
        </FormGrid>
        <FormField control={control} name="baptized" label={t("baptized")} type="checkbox" />
      </FormSection>
      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </div>
  );
}
