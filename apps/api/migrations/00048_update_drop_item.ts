import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'DropItems',
      'withDriver',
      {
        type: DataType.BOOLEAN,
        allowNull: false,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().addColumn(
      'DropItems',
      'driverUuid',
      {
        type: DataType.STRING,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().changeColumn(
      'DropItems',
      'locationId',
      {
        type: DataType.INTEGER,
        allowNull: true,
      },
      {
        transaction: tx,
      }
    );

    // Seed DropLocations
    await sequelize.getQueryInterface().bulkInsert(
      'DropItemLocations',
      [
        {
          id: 1,
          uuid: 'd0f0b1e0-0b1e-4b1e-8b1e-0b1e0b1e0b1e',
          location_name: 'Warehouse',
          location_category: 'Warehouse',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
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
    await sequelize
      .getQueryInterface()
      .removeColumn('DropItems', 'withDriver', {
        transaction: tx,
      });

    await sequelize
      .getQueryInterface()
      .removeColumn('DropItems', 'driverUuid', {
        transaction: tx,
      });

    await sequelize.getQueryInterface().changeColumn(
      'DropItems',
      'locationId',
      {
        type: DataType.INTEGER,
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
