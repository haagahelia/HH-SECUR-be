'use strict';

// Adds report statuses (model ReportStatus, added on the dev branch after the baseline was made):
//   - the table report_status (lookup table, its rows are seeded by addReportStatuses())
//   - the nullable column report.report_status_id with an index and a foreign key to report_status
//
// Safe to run on every kind of database. Each part is skipped if it is already there, which is the
// case for databases built by sync() before the switch to migrations (the dev environments):
//   - database created by the baseline migration -> both parts are added
//   - database built by sync() from the current models -> everything exists, nothing is changed
//
// Backward compatible with the previous version of the application: it only adds a table and a
// nullable column, so the old version keeps working (rule 9 in docs/migrations.md).
//
// The SQL matches what sync() generates from the models, so migrations and models describe the
// same schema (check with scripts/schema-diff.sh).

const { QueryTypes } = require('sequelize');

const tableExists = async (queryInterface, table) => {
  const tables = (await queryInterface.showAllTables())
    .map((name) => (typeof name === 'string' ? name : Object.values(name)[0]));
  return tables.includes(table);
};

const columnExists = async (queryInterface, table, column) => {
  const columns = await queryInterface.describeTable(table);
  return Object.prototype.hasOwnProperty.call(columns, column);
};

module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    if (await tableExists(queryInterface, 'report_status')) {
      console.log('report_status: table already present, skipping');
    } else {
      await sequelize.query(
        'CREATE TABLE `report_status` (' +
        '`id` bigint(20) NOT NULL AUTO_INCREMENT, ' +
        '`code` varchar(255) NOT NULL, ' +
        '`name_fi` varchar(255) NOT NULL, ' +
        '`name_en` varchar(255) NOT NULL, ' +
        '`createdAt` datetime NOT NULL, ' +
        '`updatedAt` datetime NOT NULL, ' +
        'PRIMARY KEY (`id`), ' +
        'UNIQUE KEY `report_status_code_unique` (`code`))'
      );
    }

    if (await columnExists(queryInterface, 'report', 'report_status_id')) {
      console.log('report.report_status_id: column already present, skipping');
    } else {
      // one statement, so the column, its index and its foreign key are added together
      await sequelize.query(
        'ALTER TABLE `report` ' +
        'ADD COLUMN `report_status_id` bigint(20) DEFAULT NULL AFTER `user_id`, ' +
        'ADD KEY `report_status_id` (`report_status_id`), ' +
        'ADD FOREIGN KEY (`report_status_id`) REFERENCES `report_status` (`id`) ' +
        'ON DELETE SET NULL ON UPDATE CASCADE'
      );
    }
  },

  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;

    if (await columnExists(queryInterface, 'report', 'report_status_id')) {
      // the foreign key has a generated name, so look it up
      const constraints = await sequelize.query(
        'SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE ' +
        'WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = \'report\' ' +
        'AND COLUMN_NAME = \'report_status_id\' AND REFERENCED_TABLE_NAME = \'report_status\'',
        { type: QueryTypes.SELECT }
      );
      for (const { CONSTRAINT_NAME: name } of constraints) {
        await sequelize.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`${name}\``);
      }
      await sequelize.query('ALTER TABLE `report` DROP KEY `report_status_id`, DROP COLUMN `report_status_id`');
    }

    // Reports keep no status after this. The report_status rows are seed data and are lost with the table.
    if (await tableExists(queryInterface, 'report_status')) {
      await sequelize.query('DROP TABLE `report_status`');
    }
  },
};
