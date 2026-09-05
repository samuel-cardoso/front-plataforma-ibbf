import { bffApi } from "@/infra/api/config/bff-api.config";
import { buildListParams } from "@/infra/api/helpers/query-params.helper";
import { mapFamily } from "@/infra/api/mappers/family.mapper";
import type {
  Family,
  FamilyCreateInput,
  FamilyListParams,
  FamilyUpdateInput,
} from "@/lib/types/familyApiTypes";
import type { PaginatedResult } from "@/lib/types/apiEnvelopeTypes";

export const familyService = {
  list: async (params: FamilyListParams): Promise<PaginatedResult<Family>> => {
    const response = await bffApi.get("/families", { params: buildListParams(params) });
    const raw = response.data.data as {
      families: unknown[];
      pagination: PaginatedResult<Family>["pagination"];
    };
    return { data: raw.families.map(mapFamily), pagination: raw.pagination };
  },

  get: async (id: string): Promise<Family> => {
    const response = await bffApi.get(`/families/${id}`);
    return mapFamily(response.data.data.family);
  },

  create: async (input: FamilyCreateInput): Promise<Family> => {
    const response = await bffApi.post("/families", input);
    return mapFamily(response.data.data.family);
  },

  update: async (id: string, input: FamilyUpdateInput): Promise<Family> => {
    const response = await bffApi.patch(`/families/${id}`, input);
    return mapFamily(response.data.data.family);
  },

  remove: async (id: string): Promise<void> => {
    await bffApi.delete(`/families/${id}`);
  },
};
