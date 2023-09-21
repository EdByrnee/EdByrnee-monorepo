import { Model } from 'sequelize/types';
import { IRepositoryPort } from '../ports/repository-port';

export class SequelizeRepo<T extends Model> implements IRepositoryPort<T> {
  constructor(
    private model,
    private include: any = null,
    private order: any[] = null
  ) {}

  async findOneQuery(query): Promise<T> {
    return this.model.findOne(query);
  }

  async get(uuid: string): Promise<T> {
    return this.model.findOne({ where: { uuid: uuid }, include: this.include });
  }

  async getOne(predicate): Promise<T> {
    return this.model.findOne({ where: predicate, include: this.include });
  }

  async removeMany(predicate): Promise<void> {
    return this.model.destroy({ where: predicate });
  }

  async query(predicate): Promise<T[]> {
    return this.model.findAll({
      where: predicate,
      include: this.include,
      order: this.order,
    });
  }

  async findAll(query): Promise<T[]> {
    query.include = this.include;
    query = this.setOrder(query);
    return this.model.findAll(query);
  }

  async findOne(query): Promise<T> {
    return this.model.findOne({
      where: query,
      include: this.include,
      order: this.order,
    });
  }

  async delete(t: T): Promise<void> {
    return t.destroy();
  }

  async bulkDelete(t: T[]): Promise<void> {
    const ids = t.map((row: any) => row.id);
    return this.model.destroy({
      where: {
        id: ids,
      },
    });
  }

  async create(t: T): Promise<any> {
    return t.save();
  }

  async bulkCreate(t: T[]): Promise<void> {
    return this.model.bulkCreate(t.map((t) => t.get() as T));
  }

  async update(t: T): Promise<any> {
    return t.save();
  }

  async restore(t: T): Promise<any> {
    return t.restore();
  }

  async updateQuery(updates: any, predicate: any, options?: any): Promise<T> {
    const queryOptions = options || {};
    queryOptions.where = predicate;
    return this.model.update(updates, queryOptions);
  }

  private setOrder(query) {
    return this.order && !query.order ? { ...query, order: this.order } : query;
  }
}
