'use strict';

// Baseline: the schema as it was when migrations were introduced (24 tables).
//
// The SQL lives in db/baseline.sql. It is generated from the models, not written by hand
// (see the header of scripts/clean-baseline.js). Never edit this file or baseline.sql after it
// is merged: schema changes go into NEW migrations.
//
// Safe to run on every kind of database:
//   - empty database                 -> creates the 24 tables
//   - database that already has them -> skips and only gets recorded in SequelizeMeta
//     (this is the case for the existing Azure and Rahti databases, which were built by sync())
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
  return { statements, tables };
};

module.exports = {
  async up(queryInterface) {
    const { statements, tables } = readBaseline();

    // showAllTables() returns plain names with mariadb, the map is a guard for other shapes
    const existing = (await queryInterface.showAllTables())
      .map((table) => (typeof table === 'string' ? table : Object.values(table)[0]));
    const present = tables.filter((table) => existing.includes(table));

    if (present.length === tables.length) {
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
