import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'UserProfiles',
      'story',
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

export async function down(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('UserProfiles', 'story', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
