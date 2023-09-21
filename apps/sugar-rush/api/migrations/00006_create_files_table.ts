import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import * as moment from 'moment';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'Files',
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
        bucketName: {
          type: DataType.STRING,
          unique: 'onKeyInBucket',
          allowNull: false,
        },
        fileKey: {
          type: DataType.STRING,
          unique: 'onKeyInBucket',
          allowNull: false,
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

    /* add index */
    await sequelize.getQueryInterface().addIndex('Files', {
      fields: ['bucketName', 'fileKey'],
      unique: true,
      name: 'File_bucketName_fileKey_idx',
      transaction: tx,
    });

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
    await sequelize.getQueryInterface().dropTable('Files');

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
