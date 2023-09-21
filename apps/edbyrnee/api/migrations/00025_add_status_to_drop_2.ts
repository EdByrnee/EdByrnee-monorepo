import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().changeColumn(
      'Drops',
      'status',
      {
        type: DataType.ENUM(
          'AWAITING_APPROVAL',
          'ACTIVE_LISTING',
          'DELISTED_FOR_HOLIDAY',
          'USER_DELISTED'
        ),
        allowNull: true,
      },
      { transaction: tx }
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
    await sequelize.getQueryInterface().changeColumn(
      'Drops',
      'status',
      {
        type: DataType.TEXT,
        allowNull: true,
      },
      { transaction: tx }
    );

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
