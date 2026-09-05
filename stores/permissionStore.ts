import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PermissionState = {
  /**
   * `null` = desconhecido ainda (otimista: mostrar ações de staff). `false` só é setado
   * depois que o backend rejeitar uma mutação com 403 FORBIDDEN nesta sessão.
   *
   * TODO(backend): substituir por uma checagem determinística (role.level >= STAFF_MIN_ROLE_LEVEL)
   * assim que o backend expuser o level da role do usuário logado (ex.: GET /auth/me).
   */
  isStaff: boolean | null;
  markForbidden: () => void;
  reset: () => void;
};

const permissionStore = create<PermissionState>()(
  devtools(
    (set) => ({
      isStaff: null,
      markForbidden: () => set({ isStaff: false }),
      reset: () => set({ isStaff: null }),
    }),
    { name: "PermissionStore" }
  )
);

export const usePermissionStore = permissionStore;
