/** Remove chaves com valor vazio/undefined/null antes de montar os query params da listagem. */
export function buildListParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as Partial<T>;
}
