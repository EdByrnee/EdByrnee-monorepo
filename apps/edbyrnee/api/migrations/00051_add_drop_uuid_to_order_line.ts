import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'MultiOrderLines',
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

        unit_price: {
          type: DataType.DOUBLE(15, 2),
          allowNull: false,
        },
        quantity: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        line_total: {
          type: DataType.DOUBLE(15, 2),
          allowNull: false,
        },
        dropUuid: {
          type: DataType.STRING,
          allowNull: false,
        },

        multiOrderId: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        line_title: {
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
    await sequelize.getQueryInterface().dropTable('MultiOrderLines', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
