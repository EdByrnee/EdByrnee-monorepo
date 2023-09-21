import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import { Op } from 'sequelize';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // await sequelize.getQueryInterface().dropTable('UserFCMTokens', {
    //   transaction: tx,
    // });

    // Create Scrape Log Table
    await sequelize.getQueryInterface().createTable(
      'UserFCMTokens',
      {
        id: {
          type: DataType.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uuid: {
          type: DataType.UUID,
          primaryKey: true,
          defaultValue: DataType.UUIDV4,
        },
        userUuid: {
          type: DataType.UUID,
          allowNull: false,
        },
        fcmToken: {
          type: DataType.STRING,
          allowNull: false,
        },
        deviceUuid: {
          type: DataType.UUID,
          allowNull: false,
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
    await sequelize.getQueryInterface().dropTable('UserFCMTokens', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
