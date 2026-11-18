'use strict';

// Baseline: the schema as it was when migrations were introduced (24 tables).
//
// The SQL lives in db/baseline.sql. It is generated from the models, not written by hand
// (see the header of scripts/clean-baseline.js). Never edit this file or baseline.sql after it
// is merged: schema changes go into NEW migrations.
//
// Safe to run on every kind of database:
//   - empty database                 -> creates the 24 tables
//   - database that already has them -> checks that every column of the baseline exists, then skips
//     and only gets recorded in SequelizeMeta (the existing Azure and Rahti databases were built by
//     sync()). If a column is missing the database was built from older models: it stops with an error.
//   - only some of the tables exist  -> stops with an error, someone has to look at it

const fs = require('fs');
const path = require('path');

const BASELINE_FILE = path.join(__dirname, '..', 'baseline.sql');

const readBaseline = () => {
  const sql = fs.readFileSync(BASELINE_FILE, 'utf8');
  const statements = sql
    .split(/;\s*\n/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  const unexpected = statements.filter((statement) => !statement.startsWith('CREATE TABLE `'));
  if (unexpected.length > 0) {
    throw new Error(`db/baseline.sql may only contain CREATE TABLE statements, found: ${unexpected[0].slice(0, 60)}`);
  }

  // The expected table names come from the SQL itself, so the list can never drift from it.
  const tables = statements.map((statement) => /^CREATE TABLE `([^`]+)`/.exec(statement)[1]);

  // Column names per table, also read from the SQL: column lines start with two spaces and a backtick,
  // key and constraint lines start with a keyword.
  const columns = {};
  statements.forEach((statement, index) => {
    columns[tables[index]] = statement
      .split(/\r?\n/)
      .map((line) => /^ {2}`([^`]+)`/.exec(line))
      .filter(Boolean)
      .map((match) => match[1]);
  });
  return { statements, tables, columns };
};

// Compares the columns that exist in the database with the ones in baseline.sql. Only names are
// compared, and extra columns are fine (later migrations add some). A missing column means the tables
// were built from older models, for example by an older branch. Skipping the baseline would then leave
// a schema the application cannot use.
const findMissingColumns = async (queryInterface, tables, columns) => {
  const missing = [];
  for (const table of tables) {
    const actual = Object.keys(await queryInterface.describeTable(table));
    const absent = columns[table].filter((column) => !actual.includes(column));
    if (absent.length > 0) {
      missing.push(`${table}: ${absent.join(', ')}`);
    }
  }
  return missing;
};

module.exports = {
  async up(queryInterface) {
    const { statements, tables, columns } = readBaseline();

    // showAllTables() returns plain names with mariadb, the map is a guard for other shapes
    const existing = (await queryInterface.showAllTables())
      .map((table) => (typeof table === 'string' ? table : Object.values(table)[0]));
    const present = tables.filter((table) => existing.includes(table));

    if (present.length === tables.length) {
      const missingColumns = await findMissingColumns(queryInterface, tables, columns);
      if (missingColumns.length > 0) {
        throw new Error(
          'Baseline: all tables exist but their columns differ from the baseline, so the database was ' +
          'built from older models. Missing columns: ' + missingColumns.join('; ') + '. ' +
          'If the data is disposable, empty the database (drop all tables) and run the migration again. ' +
          'Otherwise ask the team, restore from a backup or migrate the data by hand.'
        );
      }
      console.log('Baseline: schema already present, skipping');
      return;
    }
    if (present.length > 0) {
      const missing = tables.filter((table) => !existing.includes(table));
      throw new Error(
        `Baseline: the database has only some of the ${tables.length} tables. ` +
        `Present: ${present.join(', ')}. Missing: ${missing.join(', ')}. ` +
        'Fix or empty the database by hand, then run the migration again.'
      );
    }

    // SET FOREIGN_KEY_CHECKS applies to one connection, and the pool may give a different
    // connection to each query. Passing one transaction to every query keeps them all on the
    // same connection. (MariaDB commits DDL by itself, so this does not give a rollback.)
    // The dump lists the tables alphabetically, so foreign keys point to tables that do not
    // exist yet and the check has to be off while the tables are created.
    const sequelize = queryInterface.sequelize;
    const transaction = await sequelize.transaction();
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS=0', { transaction });
      try {
        for (const statement of statements) {
          await sequelize.query(statement, { transaction });
        }
      } finally {
        // the pooled connection must not keep the check switched off
        await sequelize.query('SET FOREIGN_KEY_CHECKS=1', { transaction });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback().catch(() => { });
      throw error;
    }
    console.log(`Baseline: created ${tables.length} tables`);
  },

  async down() {
    throw new Error('The baseline cannot be undone: that would drop the whole schema. Restore from a backup instead.');
  },
};
