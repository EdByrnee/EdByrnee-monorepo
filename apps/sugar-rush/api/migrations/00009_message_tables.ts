import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Create Message Thread table
    await sequelize.getQueryInterface().createTable('MessageThreads', {
      uuid: {
        type: DataType.UUID,
        allowNull: false,
      },
      id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      participent1UserUuid: {
        type: DataType.STRING,
        allowNull: false,
      },
      participent2UserUuid: {
        type: DataType.STRING,
        allowNull: false,
      },
      threadLatestRead: {
        type: DataType.BOOLEAN,
        allowNull: false,
      },
      threadLatestMessageAt: {
        type: DataType.DATE,
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
    },{
      transaction: tx,
    });

    // Create Message Table
    await sequelize.getQueryInterface().createTable('Messages', {
      uuid: {
        type: DataType.UUID,
        allowNull: false,
      },
      id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: DataType.STRING,
        allowNull: false,
      },
      senderUuid: {
        type: DataType.STRING,
        allowNull: false,
      },
      recipientUuid: {
        type: DataType.STRING,
        allowNull: false,
      },
      messageThreadId: {
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
    await sequelize.getQueryInterface().dropTable('MessageThreads', {
      transaction: tx,
    });
    await sequelize.getQueryInterface().dropTable('Messages', {
      transaction: tx
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
