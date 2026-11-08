import type { ListParams } from "./apiEnvelopeTypes";

export type Family = {
  id: string;
  name: string;
  address: string | null;
  createdAt: string;
};

export type FamilyListParams = ListParams;

export type FamilyCreateInput = {
  name: string;
  address?: string;
};

export type FamilyUpdateInput = {
  name?: string;
  address?: string | null;
};
