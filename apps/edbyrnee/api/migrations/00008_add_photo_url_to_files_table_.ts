import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {

    // add photo url to files table
    await sequelize.getQueryInterface().addColumn('Files', 'publicUrl', {
      type: DataType.STRING,
      allowNull: true,
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
    await sequelize.getQueryInterface().removeColumn('Files', 'publicUrl');
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
