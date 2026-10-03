"use client";

import { toast } from "sonner";
import {
  useTranslations,
  useMembers,
  useMinistryMemberForm,
  useAddMinistryMember,
} from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField, FormActions } from "@/components/shared/form";
import { Skeleton } from "@/components/ui/skeleton";
import { MINISTRY_ROLE_VALUES } from "@/lib/consts/ministry";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { MinistryMemberFormData } from "@/lib/zod/schemas/ministryMemberFormSchema";
import type { MinistryRole } from "@/lib/types/ministryApiTypes";

type MinistryMemberAddFormProps = {
  ministryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MinistryMemberAddForm({ ministryId, open, onOpenChange }: MinistryMemberAddFormProps) {
  const t = useTranslations("ministerios");
  const tValidation = useTranslations("validacao");
  const { members, isLoading: isLoadingMembers } = useMembers({ limit: 100 });
  const { addMember, isAdding } = useAddMinistryMember(ministryId);
  const { control, handleSubmit, reset } = useMinistryMemberForm(tValidation);

  const memberOptions = members.map((member) => ({ value: member.id, label: member.fullName }));
  const roleOptions = MINISTRY_ROLE_VALUES.map((role) => ({ value: role, label: t(`papel${role}`) }));

  const onSubmit = async (data: MinistryMemberFormData) => {
    try {
      await addMember({ memberId: data.memberId, role: data.role as MinistryRole });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("adicionarParticipante")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)} className="flex flex-col gap-4">
          {isLoadingMembers ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <FormField
              control={control}
              name="memberId"
              label={t("membro")}
              type="select"
              options={memberOptions}
              placeholder={t("membroPlaceholder")}
            />
          )}
          <FormField
            control={control}
            name="role"
            label={t("papel")}
            type="select"
            options={roleOptions}
            placeholder={t("papelPlaceholder")}
          />
          <DialogFooter>
            <FormActions onCancel={() => onOpenChange(false)} isSubmitting={isAdding} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
