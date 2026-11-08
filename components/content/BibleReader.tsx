"use client";

import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useEffect,
  useRouter,
  useSearchParams,
  useTranslations,
  useBibleVersions,
  useBibleBooks,
  useBibleChapter,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataLoadErrorState, EmptyState } from "@/components/shared";
import { cn } from "@/lib/utils";
import { paths } from "@/lib/utils/paths";
import type { BibleBook } from "@/lib/types/contentApiTypes";
import { ReadingSizeControl, useReadingSize } from "./ReadingSizeControl";

const LAST_POSITION_KEY = "ibbf:bible-position";
const DEFAULT_POSITION = { version: "ARC", book: "Gn", chapter: 1 };

type Position = typeof DEFAULT_POSITION;

function readLastPosition(): Position {
  try {
    const saved = JSON.parse(window.localStorage.getItem(LAST_POSITION_KEY) ?? "null");
    if (saved?.version && saved?.book && Number.isInteger(saved?.chapter)) return saved;
  } catch {
    // storage indisponível ou valor corrompido: começa do padrão
  }
  return DEFAULT_POSITION;
}

/**
 * Leitor por capítulo. A posição vive na URL (?v=ARC&livro=Gn&cap=1) para dar para
 * compartilhar um link; sem parâmetros, retoma o último capítulo lido neste navegador.
 */
export function BibleReader() {
  const t = useTranslations("biblia");
  const tConteudo = useTranslations("conteudo");
  const router = useRouter();
  const searchParams = useSearchParams();
  const reading = useReadingSize();

  const version = searchParams.get("v") ?? "";
  const bookAbbrev = searchParams.get("livro") ?? "";
  const chapterNumber = Number(searchParams.get("cap") ?? 0);
  const hasPosition = !!version && !!bookAbbrev && chapterNumber > 0;

  const goTo = (position: Position, mode: "push" | "replace" = "push") => {
    const query = new URLSearchParams({ v: position.version, livro: position.book, cap: String(position.chapter) });
    router[mode](`${paths.bible}?${query.toString()}`, { scroll: mode === "push" });
  };

  useEffect(() => {
    if (!hasPosition) goTo(readLastPosition(), "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPosition]);

  useEffect(() => {
    if (!hasPosition) return;
    try {
      window.localStorage.setItem(LAST_POSITION_KEY, JSON.stringify({ version, book: bookAbbrev, chapter: chapterNumber }));
    } catch {
      // idem acima
    }
  }, [hasPosition, version, bookAbbrev, chapterNumber]);

  const { versions } = useBibleVersions();
  const { books } = useBibleBooks(version);
  const { chapter, isLoading, isError, refetch } = useBibleChapter(version, bookAbbrev, chapterNumber);

  const bookIndex = books.findIndex((book) => book.abbrev.toLowerCase() === bookAbbrev.toLowerCase());
  const book: BibleBook | undefined = books[bookIndex];

  const previous = (() => {
    if (!book) return null;
    if (chapterNumber > 1) return { version, book: book.abbrev, chapter: chapterNumber - 1 };
    const previousBook = books[bookIndex - 1];
    return previousBook ? { version, book: previousBook.abbrev, chapter: previousBook.chapterCount } : null;
  })();
  const next = (() => {
    if (!book) return null;
    if (chapterNumber < book.chapterCount) return { version, book: book.abbrev, chapter: chapterNumber + 1 };
    const nextBook = books[bookIndex + 1];
    return nextBook ? { version, book: nextBook.abbrev, chapter: 1 } : null;
  })();

  const versionItems = versions.map((item) => ({ value: item.code, label: `${item.code} · ${item.name}` }));
  const chapterItems = Array.from({ length: book?.chapterCount ?? 0 }, (_, index) => ({
    value: String(index + 1),
    label: t("capituloN", { numero: index + 1 }),
  }));

  return (
    // Largura de leitura confortável (~70 caracteres por linha), como num livro.
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={version || null}
          onValueChange={(value) => value && goTo({ version: value as string, book: bookAbbrev || "Gn", chapter: chapterNumber || 1 })}
          items={versionItems}
        >
          <SelectTrigger className="w-auto min-w-28" aria-label={t("versao")}>
            <SelectValue placeholder={t("versao")}>{version}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {versionItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={book?.abbrev ?? null}
          onValueChange={(value) => value && goTo({ version, book: value as string, chapter: 1 })}
          items={books.map((item) => ({ value: item.abbrev, label: item.name }))}
        >
          <SelectTrigger className="w-44" aria-label={t("livro")}>
            <SelectValue placeholder={t("livro")} />
          </SelectTrigger>
          <SelectContent>
            {(["old", "new"] as const).map((testament) => (
              <SelectGroup key={testament}>
                <SelectLabel>{t(testament === "old" ? "antigoTestamento" : "novoTestamento")}</SelectLabel>
                {books
                  .filter((item) => item.testament === testament)
                  .map((item) => (
                    <SelectItem key={item.abbrev} value={item.abbrev}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={chapterNumber ? String(chapterNumber) : null}
          onValueChange={(value) => value && goTo({ version, book: bookAbbrev, chapter: Number(value) })}
          items={chapterItems}
        >
          <SelectTrigger className="w-36" aria-label={t("capitulo")}>
            <SelectValue placeholder={t("capitulo")} />
          </SelectTrigger>
          <SelectContent>
            {chapterItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1">
          <ReadingSizeControl size={reading.size} onChange={reading.setSize} />
          <Button variant="outline" size="icon-sm" disabled={!previous} onClick={() => previous && goTo(previous)} aria-label={tConteudo("anterior")}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon-sm" disabled={!next} onClick={() => next && goTo(next)} aria-label={tConteudo("proximo")}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      {(isLoading || !hasPosition) && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-8 w-1/3" />
            {Array.from({ length: 10 }, (_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </CardContent>
        </Card>
      )}
      {hasPosition && !isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {hasPosition && !isLoading && !isError && !chapter && <EmptyState icon={BookOpen} message={t("naoEncontrado")} />}

      {chapter && (
        <Card>
          <CardContent className="flex flex-col gap-6">
            <h1 className="font-heading text-2xl font-semibold">
              {chapter.name} {chapter.number}
            </h1>
            <div className={cn("flex flex-col gap-3 leading-relaxed", reading.className)}>
              {chapter.verses.map((verse, index) => (
                <p key={index}>
                  <sup className="mr-1.5 align-super text-[0.6em] font-semibold text-primary">{index + 1}</sup>
                  {verse}
                </p>
              ))}
            </div>
            <div className="flex justify-between gap-2 border-t pt-4">
              <Button variant="ghost" size="sm" disabled={!previous} onClick={() => previous && goTo(previous)}>
                <ChevronLeft /> {tConteudo("anterior")}
              </Button>
              <Button variant="ghost" size="sm" disabled={!next} onClick={() => next && goTo(next)}>
                {tConteudo("proximo")} <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
