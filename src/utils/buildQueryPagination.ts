import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE,
} from 'src/constants';
import { PaginationInput } from 'src/generator';

export const buildQueryPagination = (
  pagination: PaginationInput = {},
  isGetAll: boolean = false,
): { skip: number; take: number, page: number, size: number } | null => {
  const page: number = pagination.page || DEFAULT_PAGINATION_PAGE;
  const pageSize: number = pagination.size || DEFAULT_PAGINATION_SIZE;

  if (isGetAll && pageSize < 0) return null;

  const take = pageSize;
  const skip = (page - 1) * pageSize;

  return { skip, take, page, size: pageSize };
};
