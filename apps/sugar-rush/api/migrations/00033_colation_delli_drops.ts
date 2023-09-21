import { Sequelize, Transaction } from 'sequelize/types';

export async function up(sequelize: Sequelize) {
  const tx: Transaction = await sequelize.transaction();

  try {
    await sequelize.query(
      `
    
    ALTER DATABASE
    sugarrush
    CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;
    `,
      {
        transaction: tx,
      }
    );

    await sequelize.query(
      `
    
    ALTER TABLE
    DelliDrops
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
    `,
      {
        transaction: tx,
      }
    );

    // await sequelize.query(
    //   `
    // ALTER TABLE
    // DelliDrops
    // CHANGE description name
    // VARCHAR(191)§
    // CHARACTER SET utf8mb4
    // COLLATE utf8mb4_unicode_ci;
    // `,
    //   {
    //     transaction: tx,
    //   }
    // );

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
    // Revert back to utf8
    await sequelize.query(
      `

    ALTER DATABASE
    sugarrush
    CHARACTER SET = utf8
    COLLATE = utf8_general_ci;
    `,

      {
        transaction: tx,
      }
    );

    await sequelize.query(
      `

    ALTER TABLE
    DelliDrops
    CONVERT TO CHARACTER SET utf8
    COLLATE utf8_general_ci;
    `,

      {
        transaction: tx,
      }
    );

    // await sequelize.query(
    //   `

    // ALTER TABLE
    // DelliDrops
    // CHANGE name description
    // VARCHAR(191)
    // CHARACTER SET utf8
    // COLLATE utf8_general_ci;
    // `,

    //   {
    //     transaction: tx,
    //   }
    // );

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    console.log(err);
    throw err;
  }
}
