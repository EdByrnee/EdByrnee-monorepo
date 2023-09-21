import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn('Orders', 'order_status', {
      type: DataType.ENUM('OPEN', 'CLOSED'),
    });
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}

export async function down(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Orders', 'order_status');
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
