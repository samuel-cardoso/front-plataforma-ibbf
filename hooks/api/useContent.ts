import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type { SongListParams } from "@/lib/types/contentApiTypes";

/** Conteúdo estático (Bíblia, hinos, cânticos): não muda durante a sessão. */
const STATIC_CONTENT = { staleTime: Infinity, gcTime: 60 * 60 * 1000 } as const;

export const contentKeys = {
  bibleVersions: ["bible", "versions"] as const,
  bibleBooks: (version: string) => ["bible", "books", version] as const,
  bibleChapter: (version: string, abbrev: string, chapter: number) => ["bible", "chapter", version, abbrev, chapter] as const,
  songs: (kind: SongKind, params: SongListParams) => [kind, "list", params] as const,
  song: (kind: SongKind, id: number) => [kind, "detail", id] as const,
};

export function useBibleVersions() {
  const query = useQuery({ queryKey: contentKeys.bibleVersions, queryFn: endpoints.listBibleVersions, ...STATIC_CONTENT });
  return { versions: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useBibleBooks(version: string) {
  const query = useQuery({
    queryKey: contentKeys.bibleBooks(version),
    queryFn: () => endpoints.listBibleBooks(version),
    enabled: !!version,
    ...STATIC_CONTENT,
  });
  return { books: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useBibleChapter(version: string, abbrev: string, chapter: number) {
  const query = useQuery({
    queryKey: contentKeys.bibleChapter(version, abbrev, chapter),
    queryFn: () => endpoints.getBibleChapter(version, abbrev, chapter),
    enabled: !!version && !!abbrev && chapter > 0,
    ...STATIC_CONTENT,
  });
  return { chapter: query.data, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

function isNotFound(error: unknown) {
  return (error as { response?: { status?: number } } | null)?.response?.status === 404;
}

export type SongKind = "hymns" | "canticles";

const songEndpoints = {
  hymns: { list: endpoints.listHymns, get: endpoints.getHymn },
  canticles: { list: endpoints.listCanticles, get: endpoints.getCanticle },
};

export function useSongs(kind: SongKind, params: SongListParams) {
  const query = useQuery({
    queryKey: contentKeys.songs(kind, params),
    queryFn: () => songEndpoints[kind].list(params),
    placeholderData: keepPreviousData,
    ...STATIC_CONTENT,
  });
  return {
    songs: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useSong(kind: SongKind, id: number) {
  const query = useQuery({
    queryKey: contentKeys.song(kind, id),
    queryFn: () => songEndpoints[kind].get(id),
    enabled: Number.isInteger(id) && id > 0,
    // 404 não vai mudar tentando de novo.
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 3,
    ...STATIC_CONTENT,
  });
  const notFound = isNotFound(query.error);
  return {
    song: query.data,
    isLoading: query.isLoading,
    isError: query.isError && !notFound,
    isNotFound: notFound,
    refetch: query.refetch,
  };
}
