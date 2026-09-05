"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useState, useTranslations, usePermissions, useDeleteFamily } from "@/hooks";
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
import type { Family } from "@/lib/types/familyApiTypes";

type FamiliesTableProps = {
  families: Family[];
};

export function FamiliesTable({ families }: FamiliesTableProps) {
  const t = useTranslations("familias");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { deleteFamily, isDeleting } = useDeleteFamily();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteFamily(deletingId);
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
            <TableHead>{t("createdAt")}</TableHead>
            {canManage && <TableHead className="w-10">{tComum("acoes")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {families.map((family) => (
            <TableRow key={family.id}>
              <TableCell className="font-medium">{family.name}</TableCell>
              <TableCell>
                {family.createdAt ? new Date(family.createdAt).toLocaleDateString("pt-BR") : "—"}
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
                          <Link href={paths.families.edit(family.id)}>
                            <Pencil /> {tComum("editar")}
                          </Link>
                        }
                      />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeletingId(family.id)}
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
