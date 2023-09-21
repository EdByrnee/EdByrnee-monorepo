import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    // Rename participent1UserUuid to participent2UserUuid
    await sequelize
      .getQueryInterface()
      .renameColumn(
        'MessageThreads',
        'participent1UserUuid',
        'participant1UserUuid',
        {
          transaction: tx,
        }
      );
    await sequelize
      .getQueryInterface()
      .renameColumn(
        'MessageThreads',
        'participent2UserUuid',
        'participant2UserUuid',
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
    // Rename participent1UserUuid to participent2UserUuid
    await sequelize
      .getQueryInterface()
      .renameColumn(
        'MessageThreads',
        'participant1UserUuid',
        'participent1UserUuid',
        {
          transaction: tx,
        }
      );
    await sequelize
      .getQueryInterface()
      .renameColumn(
        'MessageThreads',
        'participant2UserUuid',
        'participent2UserUuid',
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
