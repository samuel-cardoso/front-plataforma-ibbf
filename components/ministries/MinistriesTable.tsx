"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useState, useTranslations, usePermissions, useDeleteMinistry } from "@/hooks";
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
import { MoreHorizontal, Pencil, Trash, Users } from "lucide-react";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import type { Ministry } from "@/lib/types/ministryApiTypes";

type MinistriesTableProps = {
  ministries: Ministry[];
  memberNameById: Record<string, string>;
};

export function MinistriesTable({ ministries, memberNameById }: MinistriesTableProps) {
  const t = useTranslations("ministerios");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { deleteMinistry, isDeleting } = useDeleteMinistry();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMinistry(deletingId);
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
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("leader")}</TableHead>
            <TableHead className="w-10">{tComum("acoes")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ministries.map((ministry) => (
            <TableRow key={ministry.id}>
              <TableCell className="font-medium">{ministry.name}</TableCell>
              <TableCell>
                {ministry.leaderId ? (memberNameById[ministry.leaderId] ?? "—") : t("semLider")}
              </TableCell>
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
                        <Link href={paths.ministries.members(ministry.id)}>
                          <Users /> {t("participantes")}
                        </Link>
                      }
                    />
                    {canManage && (
                      <>
                        <DropdownMenuItem
                          render={
                            <Link href={paths.ministries.edit(ministry.id)}>
                              <Pencil /> {tComum("editar")}
                            </Link>
                          }
                        />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingId(ministry.id)}
                        >
                          <Trash /> {tComum("excluir")}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
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
