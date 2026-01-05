type IOptions = {
  limit?: number | undefined;
  page?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
};

type IOptionsResult = {
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const page: number = Number(options.page ?? 1);
  const limit: number = Number(options.limit ?? 10);
  const skip: number = (page - 1) * limit;

  const sortBy: string | undefined = options.sortBy || "createdAt";
  const sortOrder: string | undefined = options.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
}

export default paginationSortingHelper