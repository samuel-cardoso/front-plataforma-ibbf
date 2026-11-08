"use client";

import Link from "next/link";
import { ChevronRight, Music, Search } from "lucide-react";
import { useState, useEffect, useTranslations, useDebounce, usePagination, useSongs, type SongKind } from "@/hooks";
import { Input } from "@/components/ui/input";
import { EmptyState, DataLoadErrorState, Pagination, TableSkeleton } from "@/components/shared";
import { paths } from "@/lib/utils/paths";

const PAGE_SIZE = 30;

const NAMESPACE = { hymns: "hinario", canticles: "canticos" } as const;

/** Lista com busca do Cantor Cristão ou dos cânticos — as duas APIs têm o mesmo formato. */
export function SongsPageContent({ kind }: { kind: SongKind }) {
  const t = useTranslations(NAMESPACE[kind]);
  const tComum = useTranslations("comum");
  const { page, limit, setPage, reset } = usePagination(PAGE_SIZE);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText.trim(), 300);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Hinos têm número impresso: digitar só o número leva direto a ele (a API busca por título/letra).
  const typedNumber = kind === "hymns" && /^\d+$/.test(debouncedSearch) ? Number(debouncedSearch) : null;
  const { songs, pagination, isLoading, isError, refetch } = useSongs(kind, {
    page,
    limit,
    search: typedNumber ? undefined : debouncedSearch || undefined,
  });
  const detail = (id: number) => (kind === "hymns" ? paths.hymns.detail(id) : paths.canticles.detail(id));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t("buscarPlaceholder")}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>

      {typedNumber && (
        <Link
          href={detail(typedNumber)}
          className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10"
        >
          {t("irParaNumero", { numero: typedNumber })}
          <ChevronRight className="size-4" />
        </Link>
      )}

      {!typedNumber && (
        <>
          {isLoading && <TableSkeleton columns={2} />}
          {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
          {!isLoading && !isError && songs.length === 0 && <EmptyState icon={Music} message={tComum("semResultados")} />}
          {!isLoading && !isError && songs.length > 0 && (
            <ul className="flex flex-col divide-y rounded-lg border">
              {songs.map((song) => (
                <li key={song.id}>
                  <Link
                    href={detail(song.id)}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    {kind === "hymns" && (
                      <span className="w-10 shrink-0 text-right font-mono text-sm text-muted-foreground tabular-nums">
                        {song.id}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{song.title}</span>
                      <span className="truncate text-sm text-muted-foreground">{song.lyrics.split("\n")[0]}</span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
