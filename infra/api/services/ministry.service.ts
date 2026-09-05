import { bffApi } from "@/infra/api/config/bff-api.config";
import { buildListParams } from "@/infra/api/helpers/query-params.helper";
import { mapMinistry } from "@/infra/api/mappers/ministry.mapper";
import { mapParticipation } from "@/infra/api/mappers/participation.mapper";
import type {
  Ministry,
  MinistryCreateInput,
  MinistryListParams,
  MinistryUpdateInput,
  Participation,
  ParticipationCreateInput,
  ParticipationListParams,
  ParticipationUpdateInput,
} from "@/lib/types/ministryApiTypes";
import type { PaginatedResult } from "@/lib/types/apiEnvelopeTypes";

export const ministryService = {
  list: async (params: MinistryListParams): Promise<PaginatedResult<Ministry>> => {
    const response = await bffApi.get("/ministries", { params: buildListParams(params) });
    const raw = response.data.data as {
      ministries: unknown[];
      pagination: PaginatedResult<Ministry>["pagination"];
    };
    return { data: raw.ministries.map(mapMinistry), pagination: raw.pagination };
  },

  get: async (id: string): Promise<Ministry> => {
    const response = await bffApi.get(`/ministries/${id}`);
    return mapMinistry(response.data.data.ministry);
  },

  create: async (input: MinistryCreateInput): Promise<Ministry> => {
    const response = await bffApi.post("/ministries", input);
    return mapMinistry(response.data.data.ministry);
  },

  update: async (id: string, input: MinistryUpdateInput): Promise<Ministry> => {
    const response = await bffApi.patch(`/ministries/${id}`, input);
    return mapMinistry(response.data.data.ministry);
  },

  remove: async (id: string): Promise<void> => {
    await bffApi.delete(`/ministries/${id}`);
  },

  listParticipations: async (
    ministryId: string,
    params: ParticipationListParams
  ): Promise<PaginatedResult<Participation>> => {
    const response = await bffApi.get(`/ministries/${ministryId}/members`, {
      params: buildListParams(params),
    });
    const raw = response.data.data as {
      participations: unknown[];
      pagination: PaginatedResult<Participation>["pagination"];
    };
    return { data: raw.participations.map(mapParticipation), pagination: raw.pagination };
  },

  addParticipation: async (
    ministryId: string,
    input: ParticipationCreateInput
  ): Promise<Participation> => {
    const response = await bffApi.post(`/ministries/${ministryId}/members`, input);
    return mapParticipation(response.data.data.participation);
  },

  updateParticipationRole: async (
    ministryId: string,
    memberId: string,
    input: ParticipationUpdateInput
  ): Promise<Participation> => {
    const response = await bffApi.patch(`/ministries/${ministryId}/members/${memberId}`, input);
    return mapParticipation(response.data.data.participation);
  },

  removeParticipation: async (ministryId: string, memberId: string): Promise<void> => {
    await bffApi.delete(`/ministries/${ministryId}/members/${memberId}`);
  },
};
