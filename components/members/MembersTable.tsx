"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useState, useTranslations, usePermissions, useDeleteMember } from "@/hooks";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-dialog";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import type { Member } from "@/lib/types/memberApiTypes";

type MembersTableProps = {
  members: Member[];
  familyNameById: Record<string, string>;
};

export function MembersTable({ members, familyNameById }: MembersTableProps) {
  const t = useTranslations("membros");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { deleteMember, isDeleting } = useDeleteMember();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMember(deletingId);
      setDeletingId(null);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("fullName")}</TableHead>
            <TableHead>{t("memberType")}</TableHead>
            <TableHead>{t("memberStatus")}</TableHead>
            <TableHead>{t("family")}</TableHead>
            {canManage && <TableHead className="w-10">{tComum("acoes")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.fullName}</TableCell>
              <TableCell>{t(`memberType${member.memberType}`)}</TableCell>
              <TableCell>{t(`memberStatus${member.memberStatus}`)}</TableCell>
              <TableCell>
                {member.familyId ? (familyNameById[member.familyId] ?? "—") : t("semFamilia")}
              </TableCell>
              {canManage && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        render={
                          <Link href={paths.members.edit(member.id)}>
                            <Pencil /> {tComum("editar")}
                          </Link>
                        }
                      />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeletingId(member.id)}
                      >
                        <Trash /> {tComum("excluir")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDeleteDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
