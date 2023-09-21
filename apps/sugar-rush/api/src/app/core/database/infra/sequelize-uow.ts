import { Inject, Injectable } from '@nestjs/common';
import { SEQUELIZE } from '../constants';

@Injectable()
export class SequelizeUow {
  constructor(@Inject(SEQUELIZE) private sequelize) {}

  async begin(): Promise<any> {
    return await this.sequelize.transaction();
  }

  async commit(tx: any) {
    await tx.commit();
  }

  async rollback(tx: any) {
    await tx.rollback();
  }

  async execute<T>(callable: () => Promise<T>): Promise<T> {
    const tx = await this.begin();

    try {
      const result = await callable();
      await this.commit(tx);
      return result;
    } catch (error) {
      await this.rollback(tx);
      throw error;
    }
  }
}
