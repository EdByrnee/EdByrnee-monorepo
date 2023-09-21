import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().dropTable('ConfigKeyValuePairs', {
      transaction: tx,
    });

    // Create Scrape Log Table
    await sequelize.getQueryInterface().createTable(
      'ConfigKeyValuePairs',
      {
        id: {
          type: DataType.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uuid: {
          type: DataType.UUID,
          primaryKey: false,
          defaultValue: DataType.UUIDV4,
        },
        key: {
          type: DataType.STRING,
          allowNull: false,
        },
        value: {
          type: DataType.TEXT,
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

    // Add to table
    await sequelize.getQueryInterface().bulkInsert(
      'ConfigKeyValuePairs',
      [
        {
          key: 'mobileAppConfig',
          value: JSON.stringify({
            minBinary: '1.0.10',
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
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
    await sequelize.getQueryInterface().dropTable('ConfigKeyValuePairs', {
      transaction: tx,
    });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
