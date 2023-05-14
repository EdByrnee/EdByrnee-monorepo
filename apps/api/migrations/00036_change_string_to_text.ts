import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import { Op } from 'sequelize';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Change string for token_value to text
    await sequelize.getQueryInterface().changeColumn(
      'TokenLogs',
      'token_value',
      {
        type: DataType.TEXT,
        allowNull: false,
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
    // Revert
    await sequelize.getQueryInterface().changeColumn(
      'TokenLogs',
      'token_value',
      {
        type: DataType.STRING,


        allowNull: false,
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
