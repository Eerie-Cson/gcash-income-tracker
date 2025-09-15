export interface Repository<T> {
  create(params: { data: Partial<T> }): Promise<T>;
  fetch(filter?: any): Promise<T[] | null>;
  find(filter: any): Promise<T | null>;
  // update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(filter?: { id: any }): Promise<boolean>;
}
