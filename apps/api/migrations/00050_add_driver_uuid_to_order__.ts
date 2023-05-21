import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'MultiOrders',
      'driverUuid',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'MultiOrders',
      'assignedToDriverAt',
      {
        type: DataType.DATE,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'MultiOrders',
      'deliveredAt',
      {
        type: DataType.DATE,
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
      .removeColumn('MultiOrders', 'driverUuid', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('MultiOrders', 'assignedToDriverAt', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('MultiOrders', 'deliveredAt', {
        transaction: tx,
      });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
