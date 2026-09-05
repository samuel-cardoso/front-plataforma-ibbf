import { usePermissionStore } from "@/stores/permissionStore";

/**
 * TODO(backend): trocar por uma checagem determinística (role.level >= STAFF_MIN_ROLE_LEVEL)
 * assim que o backend expuser o level da role do usuário logado (ex.: GET /auth/me).
 * Até lá, `canManage` é otimista: começa `true` e só vira `false` depois que o backend
 * rejeitar uma mutação com 403 FORBIDDEN nesta sessão (ver infra/api/config/bff-api.config.ts).
 */
export function usePermissions() {
  const isStaff = usePermissionStore((state) => state.isStaff);
  return { canManage: isStaff !== false };
}
