"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Music } from "lucide-react";
import { useTranslations, useSong, useSongs, type SongKind } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataLoadErrorState, EmptyState } from "@/components/shared";
import { cn } from "@/lib/utils";
import { paths } from "@/lib/utils/paths";
import { ReadingSizeControl, useReadingSize } from "./ReadingSizeControl";

const NAMESPACE = { hymns: "hinario", canticles: "canticos" } as const;

export function SongDetail({ kind, id }: { kind: SongKind; id: number }) {
  const t = useTranslations(NAMESPACE[kind]);
  const tConteudo = useTranslations("conteudo");
  const { song, isLoading, isError, isNotFound, refetch } = useSong(kind, id);
  // Os números são contíguos (1..total), então o total da lista diz qual é o último.
  const { pagination } = useSongs(kind, { page: 1, limit: 1 });
  const lastId = pagination?.total;
  const reading = useReadingSize();
  const routes = kind === "hymns" ? paths.hymns : paths.canticles;

  // Estrofes separadas por linha em branco; as linhas da estrofe ficam como na projeção.
  const stanzas = song?.lyrics.split(/\n{2,}/).filter((stanza) => stanza.trim()) ?? [];

  return (
    // Largura de leitura confortável (~70 caracteres por linha), como num livro.
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={routes.list} />}>
          <ArrowLeft /> {t("voltar")}
        </Button>
        <div className="flex items-center gap-1">
          <ReadingSizeControl size={reading.size} onChange={reading.setSize} />
          {id > 1 && (
            <Button variant="outline" size="icon-sm" nativeButton={false} aria-label={tConteudo("anterior")} render={<Link href={routes.detail(id - 1)} />}>
              <ChevronLeft />
            </Button>
          )}
          {lastId !== undefined && id < lastId && (
            <Button variant="outline" size="icon-sm" nativeButton={false} aria-label={tConteudo("proximo")} render={<Link href={routes.detail(id + 1)} />}>
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-8 w-2/3" />
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </CardContent>
        </Card>
      )}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {!isLoading && isNotFound && <EmptyState icon={Music} message={t("naoEncontrado")} />}

      {song && (
        <Card>
          <CardContent className="flex flex-col gap-6">
            <header className="flex flex-col gap-1">
              {kind === "hymns" && <span className="text-sm text-muted-foreground">{t("numero", { numero: song.id })}</span>}
              <h1 className="font-heading text-2xl font-semibold">{song.title}</h1>
            </header>
            <div className={cn("flex flex-col gap-6 leading-relaxed", reading.className)}>
              {stanzas.map((stanza, index) => (
                <p key={index} className="whitespace-pre-line">
                  {stanza}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
