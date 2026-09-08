export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type AuthUser = {
  id: string;
  email: string;
  roleId: string;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
};

/** Payload decodificado do JWT (sem verificação de assinatura) — só para hidratar a UI. */
export type SessionUser = {
  id: string;
  email: string;
  roleId: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
};

export type ForgotPasswordCredentials = {
  email: string;
};

export type ResetPasswordCredentials = {
  email: string;
  code: string;
  newPassword: string;
};
