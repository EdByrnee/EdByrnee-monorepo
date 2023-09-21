import { Sequelize, Transaction } from 'sequelize/types';
import { DataType } from 'sequelize-typescript';
import * as moment from 'moment';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'DropPhotos',
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
        photo_url: {
          type: DataType.STRING,
          allowNull: false,
        },
        dropId: {
          type: DataType.INTEGER,
          allowNull: false,
          references: {
            model: 'Drops',
            key: 'id',
          },
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
    await sequelize.getQueryInterface().dropTable('DropPhotos');

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
