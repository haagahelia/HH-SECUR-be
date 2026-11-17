'use strict';

// Makes sure the database and all its tables use the utf8mb4 character set.
//
// Why: the baseline does not name a character set, so tables take the default of the database server.
// A server or database with the default latin1 stores only Western European characters, and inserting
// for example "Bihać" or "Janáček" fails with "Incorrect string value". That is what happened to the
// organization seed on one of the shared environments (names were changed to ASCII to get around it).
//
// What it does:
//   - changes the default character set of the database (so new tables get utf8mb4)
//   - converts every table that is not utf8mb4 yet (ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4;
//     existing rows are converted, nothing is lost when converting from latin1)
//   - SequelizeMeta is left alone (only ASCII file names)
//
// Safe to run on every environment: a database that is already utf8mb4 is not changed at all. Without
// COLLATE the server picks the default utf8mb4 collation, so this also works on servers that lack the
// collation of another server version.
//
// Backward compatible with the previous version of the application (rule 9 in docs/migrations.md):
// no table, column or key is added or removed.
//
// Take a backup first on a shared database with data (rule 6): converting rewrites the tables.

const { QueryTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    const [database] = await sequelize.query(
      'SELECT SCHEMA_NAME AS name, DEFAULT_CHARACTER_SET_NAME AS charset ' +
      'FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = DATABASE()',
      { type: QueryTypes.SELECT }
    );

    if (database.charset === 'utf8mb4') {
      console.log('ensure-utf8mb4: database default is already utf8mb4');
    } else {
      try {
        await sequelize.query(`ALTER DATABASE \`${database.name}\` CHARACTER SET utf8mb4`);
        console.log(`ensure-utf8mb4: database default changed from ${database.charset} to utf8mb4`);
      } catch (error) {
        // Some managed servers do not allow ALTER DATABASE for the application user. The tables are
        // converted below anyway, but new tables would still get the old default: name the character
        // set in every CREATE TABLE (rule in docs/migrations.md).
        console.log(`ensure-utf8mb4: could not change the database default (${error.message}), converting the tables only`);
      }
    }

    const tables = await sequelize.query(
      'SELECT TABLE_NAME AS name, TABLE_COLLATION AS collation FROM information_schema.TABLES ' +
      "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME <> 'SequelizeMeta' " +
      "AND (TABLE_COLLATION IS NULL OR TABLE_COLLATION NOT LIKE 'utf8mb4%') ORDER BY TABLE_NAME",
      { type: QueryTypes.SELECT }
    );

    if (tables.length === 0) {
      console.log('ensure-utf8mb4: all tables are already utf8mb4');
      return;
    }

    for (const table of tables) {
      await sequelize.query(`ALTER TABLE \`${table.name}\` CONVERT TO CHARACTER SET utf8mb4`);
    }
    console.log(`ensure-utf8mb4: converted ${tables.length} tables to utf8mb4 (${tables.map((table) => table.name).join(', ')})`);
  },

  async down() {
    // Converting back to latin1 would destroy every character that latin1 cannot store, and there is
    // no reason to want it. The migration is recorded as undone and nothing is changed.
    console.log('ensure-utf8mb4: nothing to undo (converting back to latin1 would lose characters)');
  },
};
