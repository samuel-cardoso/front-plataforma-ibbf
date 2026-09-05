import { useState } from "react";

const DEFAULT_LIMIT = 20;

export function usePagination(initialLimit = DEFAULT_LIMIT) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);

  const reset = () => setPage(1);

  return { page, limit, setPage, reset };
}
