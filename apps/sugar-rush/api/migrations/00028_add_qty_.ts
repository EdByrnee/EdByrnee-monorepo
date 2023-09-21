import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {

    // await sequelize
    // .getQueryInterface()
    // .dropTable('DelliDropQtySnapshots', { transaction: tx });


    // Create delli drops table
    await sequelize.getQueryInterface().createTable(
      'DelliDropQtySnapshots',
      {
        id: {
          type: DataType.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uuid: {
          type: DataType.STRING,
          allowNull: true,
          unique: true,
        },
        createdAt: {
          type: DataType.DATE,
          allowNull: true,
        },
        updatedAt: {
          type: DataType.DATE,
          allowNull: true,
        },
        stock: {
          type: DataType.INTEGER,
          allowNull: true,
        },
        delliDropId: {
          type: DataType.INTEGER,
          allowNull: true,
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
    await sequelize
      .getQueryInterface()
      .dropTable('DelliDropQtySnapshots', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
