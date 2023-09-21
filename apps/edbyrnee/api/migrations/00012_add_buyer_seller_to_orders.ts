import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'sellerUuid',
      {
        type: DataType.UUID,
        allowNull: false,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'buyerUuid',
      {
        type: DataType.UUID,
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
    await sequelize.getQueryInterface().removeColumn('Drops', 'sellerUuid', {
      transaction: tx,
    });

    await sequelize.getQueryInterface().removeColumn('Drops', 'buyerUuid', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
