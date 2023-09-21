import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'PasswordResetTokens',
      {
        id: {
          type: DataType.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataType.INTEGER,
          unique: true,
          allowNull: false,
        },
        token: {
          type: DataType.INTEGER,
          unique: true,
          allowNull: false,
        },
        expiresOn: {
          type: DataType.INTEGER,
          unique: true,
          allowNull: false,
        },
      },
      {
        transaction: tx,
      }
    );

    await sequelize
      .getQueryInterface()
      .addColumn('UserProfiles', 'passwordResetTokenId', {
        type: DataType.INTEGER,
        allowNull: true,
      });

    await sequelize.getQueryInterface().addConstraint('UserProfiles', {
      fields: ['passwordResetTokenId'],
      type: 'foreign key',
      name: 'UserProfiles_passwordResetTokenId_fkey',
      references: {
        table: 'PasswordResetTokens',
        field: 'id',
      },
      onDelete: 'restrict',
      onUpdate: 'restrict',
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
    await sequelize
      .getQueryInterface()
      .dropTable('PasswordResetTokens', { transaction: tx });

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
