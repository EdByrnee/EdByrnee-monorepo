import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import * as moment from 'moment';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'UserProfiles',
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
          allowNull: true,
        },
        username: {
          type: DataType.STRING,
          allowNull: true,
        },
        website: {
          type: DataType.STRING,
          allowNull: true,
        },
        bio: {
          type: DataType.TEXT,
          allowNull: true,
        },
        maker: {
          type: DataType.BOOLEAN,
          allowNull: true,
        },
        photoUrl: {
          type: DataType.STRING,
          allowNull: true,
        },
        email: {
          type: DataType.STRING,
          allowNull: false,
        },
        password: {
          type: DataType.STRING,
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
        deletedAt: {
          type: DataType.DATE,
          allowNull: true,
        },
        lastSignIn: {
          type: DataType.DATE,
          allowNull: true,
        },
        emailVerified: {
          type: DataType.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
    await sequelize.getQueryInterface().dropTable('UserProfiles', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
