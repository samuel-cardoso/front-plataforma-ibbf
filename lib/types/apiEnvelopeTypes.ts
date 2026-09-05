export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  code?: string;
  message?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: Pagination;
};

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
};
