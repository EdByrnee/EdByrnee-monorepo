import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // await sequelize
    //   .getQueryInterface()
    //   .dropTable('UserPhotos', { transaction: tx });

    // Create delli drops table
    await sequelize.getQueryInterface().createTable(
      'UserPhotos',
      {
        id: {
          type: DataType.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uuid: {
          type: DataType.UUID,
          allowNull: false,
        },
        photo_url: {
          type: DataType.STRING,
          allowNull: false,
        },
        userProfileId: {
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
      .dropTable('UserPhotos', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
