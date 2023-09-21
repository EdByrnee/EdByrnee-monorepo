import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'MultiOrders',
      'deliveryLat',
      {
        type: DataType.DOUBLE(15, 2),
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'MultiOrders',
      'deliveryLng',
      {
        type: DataType.DOUBLE(15, 2),
        allowNull: true,
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
    await sequelize
      .getQueryInterface()
      .removeColumn('MultiOrderLines', 'deliveryLat', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('MultiOrderLines', 'deliveryLng', {
        transaction: tx,
      });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
