import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import * as moment from 'moment';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Create drops table and add columns
    await sequelize.getQueryInterface().createTable(
      'Drops',
      {
        id: {
          type: DataType.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        uuid: {
          type: DataType.UUID,
          unique: true,
          allowNull: false,
        },
        name: {
          type: DataType.STRING,
          allowNull: false,
        },
        description: {
          type: DataType.TEXT,
          allowNull: false,
        },
        price: {
          type: DataType.DOUBLE(15, 2),
          allowNull: true,
        },
        qty_available: {
          type: DataType.INTEGER,
          allowNull: true,
        },
        size: {
          type: DataType.TEXT,
          allowNull: true,
        },
        age_restricted: {
          type: DataType.BOOLEAN,
          allowNull: true,
        },
        ingredients: {
          type: DataType.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataType.DATE,
          allowNull: false,
          defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        updatedAt: {
          type: DataType.DATE,
          allowNull: false,
          defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
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
    // Drop drops table
    await sequelize.getQueryInterface().dropTable('Drops', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
