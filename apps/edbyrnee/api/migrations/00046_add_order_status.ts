import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().changeColumn(
      'MultiOrders',
      'order_status',
      {
        type: DataType.ENUM('OPEN', 'ASSIGNED_TO_DRIVER', 'CLOSED'),
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
    // Delete
    await sequelize.getQueryInterface().changeColumn(
      'MultiOrders',
      'order_status',
      {
        type: DataType.ENUM('OPEN', 'CLOSED'),
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
