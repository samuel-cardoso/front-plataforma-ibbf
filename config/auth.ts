export const ACCESS_TOKEN_COOKIE = "ibbf_access_token";
export const REFRESH_TOKEN_COOKIE = "ibbf_refresh_token";

// TODO(backend): substituir a mitigação otimista de hooks/ui/usePermissions.ts
// por uma checagem determinística (role.level >= STAFF_MIN_ROLE_LEVEL) assim que
// o backend expuser o level da role do usuário logado (ex.: GET /auth/me).
export const STAFF_MIN_ROLE_LEVEL = 40;
