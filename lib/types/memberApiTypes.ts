import type { ListParams } from "./apiEnvelopeTypes";

export type MemberType = "MEMBER" | "CONGREGANT" | "VISITOR";
export type MemberStatus = "ACTIVE" | "INACTIVE" | "TRANSFERRED";

export type Member = {
  id: string;
  userId: string | null;
  familyId: string | null;
  fullName: string;
  cpf: string | null;
  birthDate: string;
  phone: string | null;
  address: string | null;
  memberType: MemberType;
  memberStatus: MemberStatus;
  joinedAt: string;
  baptized: boolean;
};

export type MemberListParams = ListParams & {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  familyId?: string;
};

export type MemberCreateInput = {
  fullName: string;
  cpf?: string;
  birthDate: string;
  phone?: string;
  address?: string;
  memberType: MemberType;
  memberStatus?: MemberStatus;
  joinedAt?: string;
  baptized?: boolean;
  userId?: string;
  familyId?: string;
};

export type MemberUpdateInput = {
  fullName?: string;
  cpf?: string | null;
  birthDate?: string;
  phone?: string | null;
  address?: string | null;
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  joinedAt?: string;
  baptized?: boolean;
  familyId?: string | null;
  userId?: string | null;
};
