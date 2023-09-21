import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'DropItems',
      {
        id: {
          type: DataType.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        uuid: {
          type: DataType.UUID,
          primaryKey: true,
          defaultValue: DataType.UUIDV4,
        },
        expiration_date: {
          type: DataType.STRING,
          allowNull: false,
        },
        locationId: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        dropId: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: DataType.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataType.DATE,
          allowNull: false,
        },
      },
      {
        transaction: tx,
      }
    );

    await sequelize.getQueryInterface().createTable(
      'DropItemLocations',
      {
        id: {
          type: DataType.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        uuid: {
          type: DataType.UUID,
          primaryKey: true,
          defaultValue: DataType.UUIDV4,
        },
        location_name: {
          type: DataType.STRING,
          allowNull: false,
        },
        location_category: {
          type: DataType.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataType.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataType.DATE,
          allowNull: false,
        },
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
    // Delete
    await sequelize
      .getQueryInterface()
      .dropTable('DropItems', { transaction: tx });
    await sequelize
      .getQueryInterface()
      .dropTable('DropItemLocations', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
