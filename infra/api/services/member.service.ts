import { bffApi } from "@/infra/api/config/bff-api.config";
import { buildListParams } from "@/infra/api/helpers/query-params.helper";
import { mapMember } from "@/infra/api/mappers/member.mapper";
import type {
  Member,
  MemberCreateInput,
  MemberListParams,
  MemberUpdateInput,
} from "@/lib/types/memberApiTypes";
import type { PaginatedResult } from "@/lib/types/apiEnvelopeTypes";

export const memberService = {
  list: async (params: MemberListParams): Promise<PaginatedResult<Member>> => {
    const response = await bffApi.get("/members", { params: buildListParams(params) });
    const raw = response.data.data as {
      members: unknown[];
      pagination: PaginatedResult<Member>["pagination"];
    };
    return { data: raw.members.map(mapMember), pagination: raw.pagination };
  },

  get: async (id: string): Promise<Member> => {
    const response = await bffApi.get(`/members/${id}`);
    return mapMember(response.data.data.member);
  },

  create: async (input: MemberCreateInput): Promise<Member> => {
    const response = await bffApi.post("/members", input);
    return mapMember(response.data.data.member);
  },

  update: async (id: string, input: MemberUpdateInput): Promise<Member> => {
    const response = await bffApi.patch(`/members/${id}`, input);
    return mapMember(response.data.data.member);
  },

  remove: async (id: string): Promise<void> => {
    await bffApi.delete(`/members/${id}`);
  },
};
