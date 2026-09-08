import { bffApi } from "@/infra/api/config/bff-api.config";
import type {
  AuthUser,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  SessionUser,
} from "@/lib/types/authTypes";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await bffApi.post<{ success: true; data: { user: AuthUser } }>(
      "/auth/login",
      credentials
    );
    return response.data.data.user;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await bffApi.post<{ success: true; data: { user: AuthUser } }>(
      "/auth/register",
      credentials
    );
    return response.data.data.user;
  },

  logout: async () => {
    await bffApi.post("/auth/logout");
  },

  forgotPassword: async (credentials: ForgotPasswordCredentials) => {
    await bffApi.post("/auth/forgot-password", credentials);
  },

  resetPassword: async (credentials: ResetPasswordCredentials) => {
    await bffApi.post("/auth/reset-password", credentials);
  },

  getSession: async () => {
    const response = await bffApi.get<{ success: true; data: { user: SessionUser } }>(
      "/auth/session"
    );
    return response.data.data.user;
  },
};
