import { QueryFilter, Model, SortOrder, PopulateOptions } from 'mongoose';
import { PaginationDto } from '../dto/paginate.dto';

export const paginateResult = async <M>(
  paginationData: PaginationDto,
  query: QueryFilter<M>,
  model: Model<M>,
  population: PopulateOptions[],
  sort?: string | { [key: string]: SortOrder },
) => {
  const { limit, page } = paginationData;
  const count = await model.countDocuments(query);
  // const count = 10;
  const foundItems = await model
    .find(query)
    .skip((page - 1) * limit)
    .sort(sort)
    .limit(limit)
    .populate(population);

  const totalPages = Math.ceil(count / limit);
  const nextPage = page + 1 > totalPages ? null : page + 1;

  return {
    count,
    limit,
    totalPages,
    nextPage,
    currentPage: page,
    foundItems,
  };
};
