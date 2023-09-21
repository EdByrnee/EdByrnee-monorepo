import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'localDeliveryLat',
      {
        type: DataType.FLOAT,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'localDeliveryLng',
      {
        type: DataType.FLOAT,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'localDeliveryRadius',
      {
        type: DataType.FLOAT,
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
      .removeColumn('Drops', 'localDeliveryLat', {
        transaction: tx,
      });
    await sequelize
      .getQueryInterface()
      .removeColumn('Drops', 'localDeliveryLng', {
        transaction: tx,
      });
    await sequelize
      .getQueryInterface()
      .removeColumn('Drops', 'localDeliveryRadius', {
        transaction: tx,
      });
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
