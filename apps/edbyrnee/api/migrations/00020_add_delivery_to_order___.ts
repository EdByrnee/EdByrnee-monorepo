import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'deliveryMethod',
      {
        type: DataType.ENUM(
          'COLLECTION',
          'NATIONAL_DELIVERY',
          'LOCAL_DELIVERY'
        ),
        allowNull: false,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'collectionAddressLine1',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'collectionAddressLine2',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'collectionAddressCity',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'collectionAddressPostcode',

      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'collectionAddressCountry',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'createdAt',
      {
        type: DataType.DATE,
        allowNull: false,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'updatedAt',
      {
        type: DataType.DATE,
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
    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'deliveryMethod', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'collectionAddressLine1', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'collectionAddressLine2', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'collectionAddressCity', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'collectionAddressPostcode', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'collectionAddressCountry', {
        transaction: tx,
      });

    await sequelize.getQueryInterface().removeColumn('Orders', 'updatedAt', {
      transaction: tx,
    });

    await sequelize.getQueryInterface().removeColumn('Orders', 'createdAt', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
