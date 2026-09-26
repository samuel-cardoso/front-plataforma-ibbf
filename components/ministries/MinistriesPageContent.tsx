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
import { Search } from "lucide-react";
import { EmptyState, DataLoadErrorState, Pagination, TableSkeleton } from "@/components/shared";
import { MinistriesTable } from "./MinistriesTable";
import { MINISTRY_PAGE_SIZE } from "@/lib/consts/ministry";
import { paths } from "@/lib/utils/paths";

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-56 pl-9"
            placeholder={t("buscarPlaceholder")}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href={paths.ministries.new}>
                {t("novoMinisterio")}
              </Link>
            }
          />
        )}
      </div>

      {isLoading && <TableSkeleton columns={3} />}
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
