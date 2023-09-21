import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'localDeliveryCost',
      {
        type: DataType.DOUBLE(15, 2),
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'localDeliveryTimelines',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'nationalDeliveryCost',
      {
        type: DataType.DOUBLE(15, 2),
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'nationalDeliveryGuidelines',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'collectionGuidelines',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'collectionAddressLine1',
      {
        type: DataType.STRING,
        allowNull: true,
      },

      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'collectionAddressLine2',
      {
        type: DataType.STRING,

        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'collectionAddressCity',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'Drops',
      'collectionAddressPostcode',
      {
        type: DataType.STRING,
        allowNull: true,
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
