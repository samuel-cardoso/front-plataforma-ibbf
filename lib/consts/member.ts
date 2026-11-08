import type { FamilyRole, MemberStatus, MemberType } from "@/lib/types/memberApiTypes";

export const MEMBER_TYPE_VALUES: MemberType[] = ["MEMBER", "CONGREGANT", "VISITOR"];
export const MEMBER_STATUS_VALUES: MemberStatus[] = ["ACTIVE", "INACTIVE", "TRANSFERRED"];
/** Ordem de exibição: responsável primeiro. */
export const FAMILY_ROLE_VALUES: FamilyRole[] = ["HEAD", "SPOUSE", "CHILD", "OTHER"];

export const MEMBER_PAGE_SIZE = 20;

export const EMPTY_MEMBER_FILTERS = {
  search: "",
  memberType: "",
  memberStatus: "",
  familyId: "",
};
