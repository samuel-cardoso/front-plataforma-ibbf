"use client";

import type { Control, UseFormSetValue } from "react-hook-form";
import { HomeIcon } from "lucide-react";
import { Controller, useTranslations, useWatch, useFamily } from "@/hooks";
import { FormSection, FormGrid, FormField, FormActions } from "@/components/shared/form";
import { FamilyCombobox } from "@/components/families/FamilyCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FAMILY_ROLE_VALUES, MEMBER_STATUS_VALUES, MEMBER_TYPE_VALUES } from "@/lib/consts/member";
import type { MemberFormData } from "@/lib/zod/schemas/memberFormSchema";

type MemberFormProps = {
  control: Control<MemberFormData>;
  setValue: UseFormSetValue<MemberFormData>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function MemberForm({ control, setValue, onCancel, isSubmitting }: MemberFormProps) {
  const t = useTranslations("membros");
  const [familyId, address] = useWatch({ control, name: ["familyId", "address"] });
  const { family } = useFamily(familyId ?? "");
  const familyAddress = familyId ? family?.address : null;

  const memberTypeOptions = MEMBER_TYPE_VALUES.map((value) => ({
    value,
    label: t(`memberType${value}`),
  }));
  const memberStatusOptions = MEMBER_STATUS_VALUES.map((value) => ({
    value,
    label: t(`memberStatus${value}`),
  }));
  const familyRoleOptions = [
    { value: "none", label: t("familyRoleNone") },
    ...FAMILY_ROLE_VALUES.map((value) => ({ value, label: t(`familyRole${value}`) })),
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
            <div className="flex flex-col gap-1.5">
              <FormField
                control={control}
                name="address"
                label={t("address")}
                placeholder={t("addressPlaceholder")}
              />
              {familyAddress && familyAddress !== address && (
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  className="self-start px-0"
                  onClick={() => setValue("address", familyAddress, { shouldDirty: true })}
                >
                  <HomeIcon />
                  {t("usarEnderecoFamilia")}
                </Button>
              )}
            </div>
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
            <Controller
              control={control}
              name="familyId"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error} data-field-name="familyId">
                  <FieldLabel htmlFor="familyId">{t("family")}</FieldLabel>
                  <FamilyCombobox
                    id="familyId"
                    value={field.value ?? ""}
                    onChange={(id) => {
                      field.onChange(id);
                      if (!id) setValue("familyRole", "none");
                    }}
                    onBlur={field.onBlur}
                    invalid={!!fieldState.error}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <FormField
              control={control}
              name="familyRole"
              label={t("familyRole")}
              type="select"
              options={familyRoleOptions}
              disabled={!familyId}
            />
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
