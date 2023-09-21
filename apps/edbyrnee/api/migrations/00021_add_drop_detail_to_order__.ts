import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'dropUuid',
      {
        type: DataType.UUID,
        allowNull: false,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'dropName',
      {
        type: DataType.STRING,
        allowNull: false,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'makerName',
      {
        type: DataType.STRING,
        allowNull: false,
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
    await sequelize.getQueryInterface().removeColumn('Orders', 'dropUuid', {
      transaction: tx,
    });

    await sequelize.getQueryInterface().removeColumn('Orders', 'dropName', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
