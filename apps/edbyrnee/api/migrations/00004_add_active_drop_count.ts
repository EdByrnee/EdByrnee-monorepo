import { DataType } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize
      .getQueryInterface()
      .addColumn('UserProfiles', 'activeDropCount', {
        type: DataType.INTEGER,
        defaultValue: 0,
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
      .removeColumn('UserProfiles', 'activeDropCount');

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
