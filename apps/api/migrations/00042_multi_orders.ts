import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'MultiOrder',
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
        order_total: {
          type: DataType.DOUBLE(15, 2),
          allowNull: false,
        },
        order_status: {
          type: DataType.ENUM('OPEN', 'CLOSED'),
          allowNull: false,
        },
        deliveryAddressLine1: {
          type: DataType.STRING,
          allowNull: true,
        },
        deliveryAddressLine2: {
          type: DataType.STRING,
          allowNull: true,
        },
        deliveryAddressCity: {
          type: DataType.STRING,
          allowNull: true,
        },
        deliveryAddressPostcode: {
          type: DataType.STRING,
          allowNull: true,
        },
        deliveryAddressCountry: {
          type: DataType.STRING,
          allowNull: true,
        },
        deliveryMethod: {
          type: DataType.ENUM(
            'COLLECTION',
            'NATIONAL_DELIVERY',
            'LOCAL_DELIVERY'
          ),
          allowNull: false,
        },
        collectionAddressLine1: {
          type: DataType.STRING,
          allowNull: true,
        },
        collectionAddressLine2: {
          type: DataType.STRING,
          allowNull: true,
        },
        collectionAddressCity: {
          type: DataType.STRING,
          allowNull: true,
        },
        collectionAddressPostcode: {
          type: DataType.STRING,
          allowNull: true,
        },
        collectionAddressCountry: {
          type: DataType.STRING,
          allowNull: true,
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
    // Delete
    await sequelize
      .getQueryInterface()
      .dropTable('MultiOrder', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
