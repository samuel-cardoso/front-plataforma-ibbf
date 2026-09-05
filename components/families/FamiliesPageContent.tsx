"use client";

import Link from "next/link";
import { useState, useEffect, useTranslations, useFamilies, useDebounce, usePagination, usePermissions } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, DataLoadErrorState, Pagination } from "@/components/shared";
import { FamiliesTable } from "./FamiliesTable";
import { FAMILY_PAGE_SIZE } from "@/lib/consts/family";
import { paths } from "@/lib/utils/paths";
import { Plus } from "lucide-react";

export function FamiliesPageContent() {
  const t = useTranslations("familias");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { page, limit, setPage, reset } = usePagination(FAMILY_PAGE_SIZE);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { families, pagination, isLoading, isError, refetch } = useFamilies({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("titulo")}</h1>
        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href={paths.families.new}>
                <Plus /> {t("novaFamilia")}
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
      {!isLoading && !isError && families.length === 0 && (
        <EmptyState message={tComum("semResultados")} />
      )}
      {!isLoading && !isError && families.length > 0 && <FamiliesTable families={families} />}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
    </div>
  );
}
