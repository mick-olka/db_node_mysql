export interface QueryError {
  code?: string | null;
  errno?: number | null;
  sqlMessage?: string | null;
  sqlState?: string | null;
  index?: number | null;
  sql?: string | null;
}

export interface QueryResI {
  data: any;
  err: QueryError | null;
}

export interface QueryCBI {
  //  Query Callback Interface
  (res: QueryResI): void;
}
