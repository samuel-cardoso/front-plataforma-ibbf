import axios from "axios";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { usePermissionStore } from "@/stores/permissionStore";

/**
 * Cliente usado pelo browser para falar com as rotas BFF do próprio Next (`/api/*`),
 * nunca com o backend real diretamente — o backend real só é chamado server-side
 * (ver infra/api/config/backend-client.ts).
 */
export const bffApi = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

bffApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getAxiosErrorMessage(error);
    if (error?.response) {
      error.response.data = { ...error.response.data, message };
    }

    if (error?.response?.data?.code === "FORBIDDEN") {
      usePermissionStore.getState().markForbidden();
    }

    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      // Navegação forçada (não router.push): estamos fora de React (interceptor Axios) e
      // queremos um reload completo para descartar todo estado em memória de uma sessão morta.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
