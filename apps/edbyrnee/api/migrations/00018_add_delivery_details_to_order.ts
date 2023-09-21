import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'deliveryAddressLine1',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );
    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'deliveryAddressLine2',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'deliveryAddressCity',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'deliveryAddressPostcode',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      { transaction: tx }
    );

    await sequelize.getQueryInterface().addColumn(
      'Orders',
      'deliveryAddressCountry',
      {
        type: DataType.STRING,
        allowNull: true,
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
      .removeColumn('Orders', 'deliveryAddressLine1', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'deliveryAddressLine2', {
        transaction: tx,
      });

    await sequelize

      .getQueryInterface()
      .removeColumn('Orders', 'deliveryAddressCity', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'deliveryAddressPostcode', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('Orders', 'deliveryAddressCountry', {
        transaction: tx,
      });
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
