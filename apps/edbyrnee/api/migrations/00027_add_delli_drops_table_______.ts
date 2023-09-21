import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // await sequelize
    //   .getQueryInterface()
    //   .dropTable('DelliDrops', { transaction: tx });

    // Create delli drops table
    await sequelize.getQueryInterface().createTable(
      'DelliDrops',
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
        name: {
          type: DataType.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataType.DATE,
          allowNull: true,
        },
        updatedAt: {
          type: DataType.DATE,
          allowNull: true,
        },
        price: {
          type: DataType.DOUBLE(10, 2),
          allowNull: true,
        },
        stock: {
          type: DataType.INTEGER,
          allowNull: true,
        },
        description: {
          type: DataType.TEXT,
          allowNull: true,
        },
        likes: {
          type: DataType.INTEGER,
          allowNull: true,
        },
        madeByUsername: {
          type: DataType.STRING,
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
      .dropTable('DelliDrops', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
