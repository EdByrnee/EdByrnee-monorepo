import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import { Op } from 'sequelize';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Create Scrape Log Table

    await sequelize.getQueryInterface().createTable(
      'ScrapeLogs',
      {
        uuid: {
          type: DataType.UUID,
          primaryKey: true,
          defaultValue: DataType.UUIDV4,
        },
        scrapeName: {
          type: DataType.STRING,
          allowNull: false,
        },
        scrapeResult: {
          type: DataType.STRING,
          allowNull: false,
        },
        scrapeCount: {
          type: DataType.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataType.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataType.DATE,
          allowNull: false,
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
