"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  useEffect,
  useTranslations,
  useMinistries,
  useMembers,
  useDebounce,
  usePagination,
  usePermissions,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, DataLoadErrorState, Pagination } from "@/components/shared";
import { MinistriesTable } from "./MinistriesTable";
import { MINISTRY_PAGE_SIZE } from "@/lib/consts/ministry";
import { paths } from "@/lib/utils/paths";
import { Plus } from "lucide-react";

export function MinistriesPageContent() {
  const t = useTranslations("ministerios");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { page, limit, setPage, reset } = usePagination(MINISTRY_PAGE_SIZE);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { ministries, pagination, isLoading, isError, refetch } = useMinistries({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const { members } = useMembers({ limit: 100 });
  const memberNameById = useMemo(
    () => Object.fromEntries(members.map((member) => [member.id, member.fullName])),
    [members]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("titulo")}</h1>
        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href={paths.ministries.new}>
                <Plus /> {t("novoMinisterio")}
              </Link>
            }
          />
        )}
      </div>

      <Input
        className="w-56"
        placeholder={t("buscarPlaceholder")}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      {isLoading && <Skeleton className="h-64 w-full" />}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {!isLoading && !isError && ministries.length === 0 && (
        <EmptyState message={tComum("semResultados")} />
      )}
      {!isLoading && !isError && ministries.length > 0 && (
        <MinistriesTable ministries={ministries} memberNameById={memberNameById} />
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
    </div>
  );
}
