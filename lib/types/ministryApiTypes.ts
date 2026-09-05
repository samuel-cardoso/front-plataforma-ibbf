import type { ListParams } from "./apiEnvelopeTypes";

export type MinistryRole = "LEADER" | "MEMBER";

export type Ministry = {
  id: string;
  name: string;
  leaderId: string | null;
  description: string | null;
};

export type MinistryListParams = ListParams & {
  leaderId?: string;
};

export type MinistryCreateInput = {
  name: string;
  leaderId?: string;
  description?: string;
};

export type MinistryUpdateInput = {
  name?: string;
  leaderId?: string | null;
  description?: string | null;
};

export type Participation = {
  id: string;
  memberId: string;
  ministryId: string;
  memberName?: string;
  role: MinistryRole;
  joinedAt: string;
};

export type ParticipationListParams = ListParams & {
  role?: MinistryRole;
};

export type ParticipationCreateInput = {
  memberId: string;
  role?: MinistryRole;
  joinedAt?: string;
};

export type ParticipationUpdateInput = {
  role: MinistryRole;
};
