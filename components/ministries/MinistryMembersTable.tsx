"use client";

import { toast } from "sonner";
import { useState, useTranslations, usePermissions, useUpdateMinistryMemberRole, useRemoveMinistryMember } from "@/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-dialog";
import { Trash } from "lucide-react";
import { MINISTRY_ROLE_VALUES } from "@/lib/consts/ministry";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import type { MinistryRole, Participation } from "@/lib/types/ministryApiTypes";

type MinistryMembersTableProps = {
  ministryId: string;
  participations: Participation[];
};

export function MinistryMembersTable({ ministryId, participations }: MinistryMembersTableProps) {
  const t = useTranslations("ministerios");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { updateRole, isUpdatingRole } = useUpdateMinistryMemberRole(ministryId);
  const { removeMember, isRemoving } = useRemoveMinistryMember(ministryId);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const handleRoleChange = async (memberId: string, role: string | null) => {
    if (!role) return;
    try {
      await updateRole({ memberId, data: { role: role as MinistryRole } });
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  const handleConfirmRemove = async () => {
    if (!removingMemberId) return;
    try {
      await removeMember(removingMemberId);
      setRemovingMemberId(null);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("membro")}</TableHead>
            <TableHead>{t("papel")}</TableHead>
            <TableHead>{t("joinedAt")}</TableHead>
            {canManage && <TableHead className="w-10">{tComum("acoes")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {participations.map((participation) => (
            <TableRow key={participation.id}>
              <TableCell className="font-medium">
                {participation.memberName ?? participation.memberId}
              </TableCell>
              <TableCell>
                {canManage ? (
                  <Select
                    value={participation.role}
                    onValueChange={(value) => handleRoleChange(participation.memberId, value)}
                    disabled={isUpdatingRole}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MINISTRY_ROLE_VALUES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {t(`papel${role}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  t(`papel${participation.role}`)
                )}
              </TableCell>
              <TableCell>
                {participation.joinedAt
                  ? new Date(participation.joinedAt).toLocaleDateString("pt-BR")
                  : "—"}
              </TableCell>
              {canManage && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setRemovingMemberId(participation.memberId)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDeleteDialog
        open={!!removingMemberId}
        onOpenChange={(open) => !open && setRemovingMemberId(null)}
        onConfirm={handleConfirmRemove}
        isDeleting={isRemoving}
      />
    </>
  );
}
