import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Create Token Logs Table
    await sequelize.getQueryInterface().createTable(
      'TokenLogs',
      {
        uuid: {
          type: DataType.UUID,
          allowNull: false,
        },
        id: {
          type: DataType.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        token_value: {
          type: DataType.STRING,
          allowNull: false,
        },
        token_name: {
          type: DataType.STRING,
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
    // Drop Token Logs Table
    await sequelize
      .getQueryInterface()
      .dropTable('TokenLogs', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
