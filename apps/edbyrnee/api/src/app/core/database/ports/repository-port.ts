export interface IRepositoryPort<T> {
  get(uuid: string): Promise<T>;
  findOne(predicate): Promise<T>;
  findOneQuery(query): Promise<T>;
  findAll(predicate): Promise<Array<T>>;
  delete(t: T): Promise<void>;
  create(t: T): Promise<void>;
  bulkCreate(t: T[]): Promise<void>;
  bulkDelete(t: T[]): Promise<void>;
  update(t: T): Promise<void>;
  restore(t: T): Promise<T>;
  removeMany(predicate): Promise<void>;
}
