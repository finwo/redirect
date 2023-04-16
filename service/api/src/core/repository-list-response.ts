export type RepositoryListResponse<T = unknown> = {
  offset: number;
  limit : number;
  data  : T[];
}
