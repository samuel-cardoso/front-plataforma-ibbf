"use client";

import { toast } from "sonner";
import { useTranslations, useFinanceUsers, useAssignFinanceRole, useRevokeFinanceRole } from "@/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataLoadErrorState, TableSkeleton } from "@/components/shared";
import { ASSIGNABLE_FINANCE_ROLES } from "@/lib/consts/finance";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import type { FinanceRole, FinanceUser } from "@/lib/types/financeApiTypes";

const NONE = "none";

/** Quem acessa o financeiro e com qual papel. Só o Pastor Titular vê esta aba. */
export function FinanceAccessSettings() {
  const t = useTranslations("financeiro");
  const { users, isLoading, isError, refetch } = useFinanceUsers();
  const { assignRole } = useAssignFinanceRole();
  const { revokeRole } = useRevokeFinanceRole();

  const roleItems = [
    { value: NONE, label: t("semAcessoFinanceiro") },
    ...ASSIGNABLE_FINANCE_ROLES.map((role) => ({ value: role, label: t(`papel${role}`) })),
  ];

  const save = async (user: FinanceUser, role: string, canViewIndividualGiving: boolean) => {
    try {
      if (role === NONE) {
        await revokeRole(user.userId);
      } else {
        await assignRole({ userId: user.userId, data: { role: role as FinanceRole, canViewIndividualGiving } });
      }
      toast.success(t("acessoAtualizado"));
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  if (isLoading) return <TableSkeleton columns={3} />;
  if (isError) return <DataLoadErrorState onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <p>{t("acessoDescricao")}</p>
        <p>{t("acessoIndividualDescricao")}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("usuario")}</TableHead>
            <TableHead>{t("papelFinanceiro")}</TableHead>
            <TableHead>{t("verContribuicoesIndividuais")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.userId}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.memberName ?? user.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.memberName ? `${user.email} · ` : ""}
                    {user.roleName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={user.financeRole ?? NONE}
                  onValueChange={(value) => save(user, (value as string) ?? NONE, user.canViewIndividualGiving)}
                  items={roleItems}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={user.canViewIndividualGiving}
                  disabled={!user.financeRole}
                  onCheckedChange={(checked) => user.financeRole && save(user, user.financeRole, !!checked)}
                  aria-label={t("verContribuicoesIndividuais")}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
