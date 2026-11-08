import { bffApi } from "@/infra/api/config/bff-api.config";
import { buildListParams } from "@/infra/api/helpers/query-params.helper";
import type { PaginatedResult } from "@/lib/types/apiEnvelopeTypes";
import type { BibleBook, BibleChapter, BibleVersion, Song, SongListParams } from "@/lib/types/contentApiTypes";

// As APIs de conteúdo já devolvem os shapes finais (validados por Zod na saída),
// então aqui só desembrulhamos o envelope `{ success, data }`.
export const bibleService = {
  listVersions: async (): Promise<BibleVersion[]> => (await bffApi.get("/bible/versions")).data.data.versions,
  listBooks: async (version: string): Promise<BibleBook[]> =>
    (await bffApi.get(`/bible/versions/${version}/books`)).data.data.books,
  getChapter: async (version: string, abbrev: string, chapter: number): Promise<BibleChapter> =>
    (await bffApi.get(`/bible/versions/${version}/books/${abbrev}/chapters/${chapter}`)).data.data.chapter,
};

function songService(resource: "hymns" | "canticles", itemKey: "hymn" | "canticle") {
  return {
    list: async (params: SongListParams): Promise<PaginatedResult<Song>> => {
      const response = await bffApi.get(`/${resource}`, { params: buildListParams(params) });
      const raw = response.data.data;
      return { data: raw[resource], pagination: raw.pagination };
    },
    get: async (id: number): Promise<Song> => (await bffApi.get(`/${resource}/${id}`)).data.data[itemKey],
  };
}

export const hymnService = songService("hymns", "hymn");
export const canticleService = songService("canticles", "canticle");
