import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'localDeliveryEnabled',
      {
        type: DataType.BOOLEAN,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'nationalDeliveryEnabled',
      {
        type: DataType.BOOLEAN,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'collectionEnabled',
      {
        type: DataType.BOOLEAN,
      },
      {
        transaction: tx,
      }
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
      .removeColumn('Drops', 'localDeliveryEnabled', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Drops', 'nationalDeliveryEnabled', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Drops', 'collectionEnabled', {
        transaction: tx,
      });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
