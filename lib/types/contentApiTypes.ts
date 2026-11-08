import type { ListParams } from "./apiEnvelopeTypes";

export type BibleVersion = { code: string; name: string };

export type BibleTestament = "old" | "new";

export type BibleBook = {
  abbrev: string;
  name: string;
  testament: BibleTestament;
  chapterCount: number;
};

export type BibleChapter = {
  abbrev: string;
  name: string;
  testament: BibleTestament;
  number: number;
  /** Índice 0 = versículo 1. */
  verses: string[];
};

/** Hino do Cantor Cristão ou cântico: mesmo formato nas duas APIs. */
export type Song = {
  id: number;
  title: string;
  lyrics: string;
};

export type SongListParams = ListParams;
