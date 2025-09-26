export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface QueryOptions {
  pagination?: {
    page: number;
    limit: number;
  };
  orderBy?: {
    column: string;
    direction?: 'ASC' | 'DESC';
  };
  searchTerm?: string;
  filterType?: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Repository<T> {
  create(params: { data: Partial<T> }): Promise<T>;
  fetch(filter?: any, orderBy?: any): Promise<T[]>;
  find(filter: any): Promise<T | null>;
  update(filter: any, data: Partial<T>): Promise<T | null>;
  delete(filter: any): Promise<boolean>;
}
