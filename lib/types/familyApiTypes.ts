import type { ListParams } from "./apiEnvelopeTypes";

export type Family = {
  id: string;
  name: string;
  createdAt: string;
};

export type FamilyListParams = ListParams;

export type FamilyCreateInput = {
  name: string;
};

export type FamilyUpdateInput = {
  name?: string;
};
