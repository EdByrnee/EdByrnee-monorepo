import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize
      .getQueryInterface()
      .renameColumn(
        'Drops',
        'localDeliveryTimelines',
        'localDeliveryGuidelines'
      );
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}

export async function down(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize
      .getQueryInterface()
      .renameColumn(
        'Drops',
        'localDeliveryGuidelines',
        'localDeliveryTimelines'
      );
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
