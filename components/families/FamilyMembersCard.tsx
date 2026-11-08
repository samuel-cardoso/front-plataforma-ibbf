"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { useTranslations, useMembers } from "@/hooks";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FAMILY_ROLE_VALUES } from "@/lib/consts/member";
import { paths } from "@/lib/utils/paths";
import type { Member } from "@/lib/types/memberApiTypes";

/** Responsável primeiro, depois cônjuge, filhos, outros e por fim quem não tem parentesco informado. */
const roleOrder = (member: Member) =>
  member.familyRole ? FAMILY_ROLE_VALUES.indexOf(member.familyRole) : FAMILY_ROLE_VALUES.length;

type FamilyMembersCardProps = { familyId: string };

/** Lista somente-leitura dos membros vinculados à família (o vínculo é feito no formulário de membro). */
export function FamilyMembersCard({ familyId }: FamilyMembersCardProps) {
  const t = useTranslations("familias");
  const tMembers = useTranslations("membros");
  const { members, pagination, isLoading } = useMembers({ familyId, limit: 100 });
  const sortedMembers = [...members].sort((a, b) => roleOrder(a) - roleOrder(b));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("membrosDaFamilia")}</CardTitle>
        <CardDescription>{t("membrosDaFamiliaDescricao")}</CardDescription>
        {!isLoading && members.length > 0 && (
          <CardAction className="text-sm text-muted-foreground">
            {t("totalMembros", { count: pagination?.total ?? members.length })}
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("semMembros")}</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-lg border">
            {sortedMembers.map((member) => (
              <li key={member.id}>
                <Link
                  href={paths.members.edit(member.id)}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{member.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.familyRole
                        ? tMembers(`familyRole${member.familyRole}`)
                        : tMembers("familyRoleNone")}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {tMembers(`memberType${member.memberType}`)}
                    <ChevronRightIcon className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
