export class PaginationDto {
  limit: number;
  page: number;
}

export type PaginationResponseDto<T> = {
  count: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
  currentPage: number;
  foundItems: Array<T>;
};
