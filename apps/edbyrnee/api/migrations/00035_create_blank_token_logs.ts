import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import { Op } from 'sequelize';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Create Token Logs Entries
    await sequelize.getQueryInterface().bulkInsert(
      'TokenLogs',
      [
        {
          uuid: '00000000-0000-0000-0000-000000000000',
          token_value: '0',
          token_name: 'access_token',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '00000000-0000-0000-0000-000000000001',
          token_value: '0',
          token_name: 'refresh_token',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        transaction: tx,
      }
    );

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}

export async function down(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Delete
    await sequelize.getQueryInterface().bulkDelete(
      'TokenLogs',
      {
        uuid: {
          [Op.in]: [
            '00000000-0000-0000-0000-000000000000',
            '00000000-0000-0000-0000-000000000001',
          ],
        },
      },
      {
        transaction: tx,
      }
    );

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
