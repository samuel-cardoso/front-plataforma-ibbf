export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type AuthUser = {
  id: string;
  email: string;
  roleId: string;
  status: UserStatus;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};

/**
 * Payload decodificado do JWT (sem verificação de assinatura) — só para hidratar a UI.
 * `emailVerifiedAt` não vem do token — só existe aqui logo após login/registro/verificação
 * nesta aba (cache do React Query populado com o `AuthUser` da resposta). Num reload de
 * página a sessão é reidratada só com decode do JWT e o campo volta a ficar `undefined`.
 */
export type SessionUser = {
  id: string;
  email: string;
  roleId: string;
  emailVerifiedAt?: string | null;
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

export type VerifyEmailCredentials = {
  email: string;
  code: string;
};

export type ResendVerificationCredentials = {
  email: string;
};
