# Database migrations

This document explains how the database schema of HH-SECUR-be is managed with **migrations**: what they are, why the project uses them, how to set up your environment, how to change the database, and what the rules are. It is written for the current team and for any future team that takes over the project, so it tries to explain things instead of assuming prior knowledge.

> **Read this first: current status (last updated 2026-11-16)**
>
> The migration tooling, the baseline migration and the persistence-safe seeding (Phase 4a) are in place, but the application **has not been switched over yet**. `src/index.ts` still runs `drop()` and `sync()` on every start, which deletes and recreates all tables, so **all data is still lost each time the server starts**. The switch-over (Phase 4b in [section 2](#2-status-and-roadmap)) removes this. Until then:
>
> - run `npm run migrate` to build or check the schema, as described below;
> - **do not write new schema-changing migrations yet** (see [why](#why-not-yet));
> - the sections that describe the future behavior are marked **(planned)**.
>
> When a phase is completed, update the status table in section 2 and this box.

## Table of contents

1. [Introduction: what are migrations and why do we use them](#1-introduction-what-are-migrations-and-why-do-we-use-them)
2. [Status and roadmap](#2-status-and-roadmap)
3. [What was added to the repository](#3-what-was-added-to-the-repository)
4. [Setting up your environment](#4-setting-up-your-environment)
5. [Everyday commands](#5-everyday-commands)
6. [How to change the database schema](#6-how-to-change-the-database-schema)
7. [Team rules](#7-team-rules)
8. [The baseline migration in detail](#8-the-baseline-migration-in-detail)
9. [Seed data and migrations](#9-seed-data-and-migrations)
10. [Shared environments and deployment](#10-shared-environments-and-deployment)
11. [Backups and restore](#11-backups-and-restore)
12. [Troubleshooting](#12-troubleshooting)
13. [Decisions, findings and open questions](#13-decisions-findings-and-open-questions)
14. [Glossary and further reading](#14-glossary-and-further-reading)

---

## 1. Introduction: what are migrations and why do we use them

### 1.1 The problem we had

The backend describes its tables in TypeScript classes, the **models** in `src/data/models/*.ts` (25 of them). Until now, every time the server started, `src/index.ts` did this:

```ts
await repository.sequelizeClient.drop();   // delete all tables
await repository.sequelizeClient.sync();   // create them again from the models
await addDataToAllTables();                // insert the fixed data again
```

That is convenient while the data is disposable, but it has serious consequences:

- **All data is lost on every restart and every deploy.** Saved reports and any manually added data disappear.
- **There is no history of schema changes.** Nobody can see when a column was added or why.
- **There is no safe way to change a database that has real data.** `sync()` can only create tables that are missing. It cannot rename a column, change a type, or move data.

Migrations solve this. The database is kept, and each change to its structure is described in a small, reviewed file.

### 1.2 What a migration is

A migration is a small JavaScript file that describes **one change to the database structure** (and sometimes to its data). Think of it as *a git commit for the database schema*.

Every migration has two functions:

- `up` applies the change, for example "create table X" or "add column Y".
- `down` undoes it, for example "drop table X" or "remove column Y".

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('report', 'description', { type: Sequelize.STRING, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('report', 'description');
  },
};
```

*(This is an illustration, the column does not exist.)*

Migration files live in `db/migrations/` and have a timestamp in the name, for example `20261115184302-baseline.js`. They run **in filename order**, oldest first.

The database remembers which migrations it has already run in a table called **`SequelizeMeta`** (one row per migration file name). When you run `npm run migrate`, the tool compares the files in `db/migrations/` with the rows in `SequelizeMeta` and runs only the missing ones. This means:

- a brand new, empty database gets *all* migrations and ends up with the current schema;
- an old database gets only the migrations it has not seen yet;
- everyone who runs the same migrations ends up with the same schema.

### 1.3 Models and migrations are two different things

| | Models (`src/data/models/*.ts`) | Migrations (`db/migrations/*.js`) |
|---|---|---|
| What they are | How the **code** sees the tables | The actual **changes** applied to the database |
| Used by | The running application | The migration tool (`npm run migrate`) |
| Changed when | The code needs a new or changed field | The real database structure must change |

**They must always be changed together.** If you add a field to a model but write no migration, the code expects a column that the database does not have. If you write a migration but do not update the model, the code never uses the new column. Every pull request that changes the schema updates both. This is [rule 1](#7-team-rules).

### 1.4 Migrations are not seed data

*Seed data* is the fixed content the application needs to work: option lists (`option1`, `option2`...), countries with their risk values, organizations, the default users. It is inserted by the function `addDataToAllTables()` in `src/utils/utils.ts` every time the server starts. Migrations describe **structure**, the seed function fills **content**. See [section 9](#9-seed-data-and-migrations).

### 1.5 One limitation you must know

MariaDB **cannot roll back schema changes**. Each `CREATE TABLE`, `ALTER TABLE` and so on takes effect immediately and permanently, even inside a transaction. So if a migration fails halfway, the first half stays applied and the migration is not recorded as done. This is why:

- each migration should be **small and do one thing**;
- you take a **backup** before any migration that deletes or rewrites data;
- `down` is a convenience for development, not a safety net for production.

### 1.6 Which tool, and why

The project uses **Sequelize-CLI** (`sequelize-cli`), the command-line tool belonging to the Sequelize library the backend already uses. Migrations are plain `.js` files (the project is CommonJS, and the CLI loads them directly, with no build step).

An early report suggested Umzug as an alternative. The decision taken was Sequelize-CLI. Its main limitation is that **it has no locking**: if two copies of the application run migrations at the same moment, they can collide. That is why the cloud deployment must run a single replica (see [section 10](#10-shared-environments-and-deployment)).

---

## 2. Status and roadmap

The work is split into phases. Phases 1 to 4a change nothing about how the application behaves, so the old behavior and the migration tooling can exist side by side until Phase 4b.

| Phase | What | Status |
|---|---|---|
| 1 | Answer the open questions in [section 13](#13-decisions-findings-and-open-questions) and take verified backups of shared databases | **Open**, needs the team |
| 2 | Tooling: `sequelize-cli`, `.sequelizerc`, `db/config.js`, npm scripts | **Done** |
| 3 | Baseline: `db/baseline.sql` and the baseline migration, generated from the models | **Done** |
| 4a | Make seeding safe for persistent data (see [section 9](#9-seed-data-and-migrations)) | **Done** |
| **4b** | **Remove `drop()` and `sync()` from `src/index.ts`, run migrations when the container starts** | **Not done. Point of no return.** |
| 5 | Switch the shared environments over, one at a time (Azure dev first, then Rahti) | Not done |
| 6 | PR template, README section (done), optional CI workflow | Partly done |
| 7 | First real migrations | **Started:** `add-report-status` (see [6.6](#66-writing-schema-changes-before-phase-4b)). The rest needs its scope revisited ([section 13](#13-decisions-findings-and-open-questions)) |

### What is *not* done yet

So that nobody assumes otherwise:

- the server still deletes and recreates all tables on start (`src/index.ts` lines 14-15);
- the `Dockerfile` still ends with `CMD ["npm", "start"]`, it does not run migrations;
- the Azure workflow (`.github/workflows/azure-backend-dev.yml`) is unchanged and no environment has been switched over;
- there is no CI check that compares the models with the migrations;
- there is no `npm run db:reset` script (use the manual commands in [section 4.4](#44-variations)).

### <a id="why-not-yet"></a>Why not write schema-changing migrations yet

While `drop()` and `sync()` still run on start, the server rebuilds every table from the models each time. A migration such as "add column X" would then find that the column already exists (the model created it) and fail, and the data it was meant to keep is gone anyway. Real migrations only make sense from Phase 4b on, **unless they skip what already exists**. That is how `add-report-status` was written, because `dev` gained a table before Phase 4b and the baseline could not include it (see [6.6](#66-writing-schema-changes-before-phase-4b)).

---

## 3. What was added to the repository

The only changes in `src/` (the application code) are the two seeding fixes of Phase 4a, see [9.2](#92-known-problems-that-appear-as-soon-as-data-persists). Start-up behavior is unchanged.

| Path | What it is | Edit it? |
|---|---|---|
| `scripts/test-seed.ts` | Runs the seed twice on a scratch database and checks that it is safe on persistent data, see [9.4](#94-testing-the-seed) | Rarely |
| `.sequelizerc` | Tells the CLI where the config and the migrations are | Rarely |
| `db/config.js` | Database connection for the CLI. Reads the same `DB_*` variables as the app, with the same `DB_SSL` rule. One block is used for every environment. | Rarely |
| `db/migrations/` | The migration files: the baseline and `add-report-status`. | Add new files, **never edit merged ones** |
| `db/migrations/<timestamp>-baseline.js` | The baseline migration, see [section 8](#8-the-baseline-migration-in-detail) | **Never** |
| `db/baseline.sql` | The schema of the first 24 tables, as SQL. Used only by the baseline migration. Tables added later are in their own migrations. | **Never by hand** |
| `scripts/sync-schema.ts` | Builds the schema from the models with `sync()`. Refuses to run unless the database name contains `baseline` or `drift`. | Rarely |
| `scripts/clean-baseline.js` | Turns a raw database dump into `db/baseline.sql`. The regeneration steps are in its header. | Rarely |
| `scripts/schema-diff.sh` | Compares the schema of two databases | Rarely |
| `.gitattributes` | Keeps `*.sh` files on LF line endings, so they work in Linux containers even when checked out on Windows | Rarely |
| `package.json` | New scripts `migrate`, `migrate:undo`, `migrate:status`, `migrate:new`. New dev dependency `sequelize-cli`. The unused package `@sequelize/mariadb` was removed. | When needed |

Why `sequelize-cli` is a *dev* dependency: the Dockerfile runs a full `npm ci`, which installs dev dependencies too, so it is available inside the container.

---

## 4. Setting up your environment

You need a database that has the 24 tables. The recommended setup is **MariaDB in Docker** (from the project's compose file) and the backend running on your machine with `npm run dev`.

### 4.1 Prerequisites

- **Git** and **Node.js 22 or newer.** The Docker image uses Node 22; the tooling was tested on Node 22 and 24.
- **Docker Desktop**, running. Check with `docker info`: it must print server information, not an error.
- A copy of this repository on the branch you work on (`dev`, or a branch from it).

### 4.2 First-time setup, step by step

All commands are run in the project root (`HH-SECUR-be/`). Commands that differ between shells are shown for both.

**Step 1. Install the dependencies**

```bash
npm ci
```

**Step 2. Create your `.env`**

```bash
cp .env.example .env
```

PowerShell: `Copy-Item .env.example .env`

Then edit `.env`. The values that matter for the database are listed here. **They are easy to get wrong**, so read the notes:

| Variable | What to put | Why |
|---|---|---|
| `DB_HOST` | `localhost` | You run the backend on your machine, the database is in Docker and published on your machine |
| `DB_PORT` | `3306`, **or `3307` if port 3306 is already in use** | The host port Docker publishes the database on. See [4.5](#45-port-3306-is-already-in-use) |
| `DB_USERNAME` | Any name **except `root`**, for example `hh_secur_user` | The MariaDB image refuses to create a user called `root`, and the database container will not start |
| `DB_PASSWORD` | A password. **It must not be empty.** | If it is empty, the image does not create the user at all and every login fails with "Access denied" |
| `DB_DATABASE` | For example `hh_secur` | Name of the database the app uses |
| `MARIADB_ROOT_PASSWORD` | A password for the database's root account | Required by the image on first start. Also needed for the scratch-database commands in [section 8](#8-the-baseline-migration-in-detail) |
| `DB_SSL` | Leave it out for local Docker. `true` only for remote databases that require SSL (for example Azure). | Used by both the app and the migration tool |

Never commit `.env`. It is in `.gitignore`. All other variables (`JWT_SECRET`, `DEFAULT_USER_*`...) are described in [`.env.example`](../.env.example) and in the README.

> **Important:** MariaDB reads `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` and `MARIADB_ROOT_PASSWORD` **only when its data volume is created**. If you change them later, you must recreate the volume (see [4.4](#44-variations), "Start from scratch") or the old credentials stay in use.

**Step 3. Start the database**

```bash
docker compose -f docker-compose-dbbe.yaml up -d --wait hh_secur_db_service
```

This starts only the database container (`hh_secur_db_container`) and waits until it is healthy. The first run downloads the MariaDB image and takes a minute.

**Step 4. Build the schema with migrations**

```bash
npm run migrate
```

Expected output:

```
== 20261115184302-baseline: migrating =======
Baseline: created 24 tables
== 20261115184302-baseline: migrated (0.161s)
== 20261116101512-add-report-status: migrating =======
== 20261116101512-add-report-status: migrated (0.047s)
```

Check it:

```bash
npm run migrate:status
```

```
up 20261115184302-baseline.js
up 20261116101512-add-report-status.js
```

`up` means the migration has been applied, `down` means it is waiting to be applied.

**Step 5. Start the backend**

```bash
npm run dev
```

Expected log lines: `Backend is running`, `Succsefully connected to database` (the typo is in the code), `API running on 3000`.

> **While Phase 4b is not done**, the server first drops and recreates all tables, then inserts the seed data. Your schema is then the one built from the models, which is identical to the migrated one (this was verified). It also means data you created is gone after each start.

**Step 6. Check that it works**

```bash
curl http://localhost:3000/status
```

PowerShell: use `curl.exe`, because `curl` is an alias for something else there.

Expected: `{"ok":true}`.

To look inside the database:

```bash
docker exec -it hh_secur_db_container sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" hh_secur'
```

Then, for example, `SHOW TABLES;` (26 rows: the 25 model tables plus `SequelizeMeta`) and `SELECT * FROM SequelizeMeta;`. Replace `hh_secur` with your `DB_DATABASE`. Leave with `exit`.

### 4.3 Running the backend and the database together (full Compose)

```bash
docker compose -f docker-compose-dbbe.yaml up --build
```

This also builds and starts the backend container. Inside Compose the backend reaches the database by the service name (`DB_HOST` and `DB_PORT` are overridden to `hh_secur_db_service` and `3306`), so `DB_PORT=3307` in your `.env` only affects the port published on your machine. See the Docker Compose guide in the README for details.

Note that the backend container does **not** run migrations yet (Dockerfile, [section 2](#what-is-not-done-yet)). Because the old behavior still builds the tables itself, the container works as before.

### 4.4 Variations

**I already have a local database with tables (built by the old server).** Run `npm run migrate`. The baseline sees that all 24 tables exist, does not touch them, and only records itself in `SequelizeMeta`. You will see `Baseline: schema already present, skipping`. This is the normal and safe case, and it is also what will happen on the shared environments.

**Start from scratch (empty local database).** This deletes all local data and all database users, then recreates them from your `.env`:

```bash
docker compose -f docker-compose-dbbe.yaml down -v
docker compose -f docker-compose-dbbe.yaml up -d --wait hh_secur_db_service
npm run migrate
```

Do this too after changing `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` or `MARIADB_ROOT_PASSWORD`. **Only ever on your own machine.**

**I want to use my own MariaDB or MySQL server, not Docker.** Create an empty database and a user with full rights on it, put the details in `.env` (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`), and run `npm run migrate`. The migration tool does not create the database itself. The scripts in [section 8](#8-the-baseline-migration-in-detail) assume the Docker container.

**The database is remote and needs SSL.** Set `DB_SSL=true` in `.env`. The same rule is used by the app (`BaseRepository.ts`) and the migration tool (`db/config.js`): `ssl: { rejectUnauthorized: true }`.

**I pulled changes that contain a new migration.** Run `npm run migrate`. It applies only what is missing.

### 4.5 Port 3306 is already in use

If another MariaDB or MySQL runs on your machine (a Windows service, XAMPP, Homebrew...), it already owns port 3306. Docker can still start the container, but on `localhost:3306` you reach **the other server**, not the one in Docker. The typical symptom is `Access denied for user '<name>'@'localhost'` although the password is correct.

Check what listens on 3306:

- PowerShell: `Get-NetTCPConnection -LocalPort 3306 -State Listen`, then `Get-Process -Id <OwningProcess>`
- macOS / Linux: `lsof -i :3306`

The fix is a different host port. In `.env` set `DB_PORT=3307`, then recreate the container so it is published on the new port:

```bash
docker compose -f docker-compose-dbbe.yaml up -d --wait hh_secur_db_service
docker port hh_secur_db_container
```

`docker port` should now show `3306/tcp -> 0.0.0.0:3307`. Do not stop or modify the other database, someone may depend on it.

---

## 5. Everyday commands

Run them in the project root. The database in `.env` must be running.

| Goal | Command | Notes |
|---|---|---|
| Apply all pending migrations | `npm run migrate` | Safe to run repeatedly |
| See what has run | `npm run migrate:status` | `up` = applied, `down` = pending |
| Undo the **latest** migration | `npm run migrate:undo` | **Never on a shared database.** Local only. |
| Create a new empty migration | `npm run migrate:new -- add-description-to-report` | The `--` is required. Creates `db/migrations/<timestamp>-add-description-to-report.js` |
| Start the database only | `docker compose -f docker-compose-dbbe.yaml up -d --wait hh_secur_db_service` | |
| Stop it (keep data) | `docker compose -f docker-compose-dbbe.yaml down` | |
| Delete the local database | `docker compose -f docker-compose-dbbe.yaml down -v` | **Local only.** Deletes all data. |

There is deliberately no "undo all" script. `npm run migrate:undo` goes back one step at a time. Do not use `model:generate` from the CLI: the models are `sequelize-typescript` classes and are written by hand.

---

## 6. How to change the database schema

> **Wait for Phase 4b before doing this for real** ([why](#why-not-yet)). The procedure below is what the team will follow from then on. If a schema change reaches `dev` before that, follow [6.6](#66-writing-schema-changes-before-phase-4b).

### 6.1 Checklist

1. Change the **model** in `src/data/models/` (new field, new model, new index...).
2. Create the migration: `npm run migrate:new -- <what-it-does>`.
3. Write `up` and `down` in the new file.
4. Test it locally: `npm run migrate`, check the result, `npm run migrate:undo`, check again, `npm run migrate`.
5. Update the seed data (`addDataToAllTables()`) if the change needs it.
6. Update `docs/database_model.md` if tables or columns were added or removed.
7. Commit the model change **and** the migration file in the same pull request.

### 6.2 Worked example (hypothetical)

Goal: reports get an optional free-text `description`.

**Model**, in `src/data/models/Report.ts`:

```ts
@AllowNull(true)
@Column({
    type: DataType.STRING,
    field: "description",
})
declare description: string | null;
```

**Migration**, created with `npm run migrate:new -- add-description-to-report`:

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('report', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('report', 'description');
  },
};
```

Use the **real table and column names from the database**, not the TypeScript property names. They are in `db/baseline.sql`.

> **Naming is not consistent in this database.** Table names are `snake_case` singular (`report_snapshot`) and foreign keys are `<name>_id`. The timestamp columns differ: 20 tables use `createdAt` / `updatedAt` and 4 tables (`funding`, `report`, `report_snapshot`, `user`) use `created_at` / `updated_at`. Check `db/baseline.sql` or `DESCRIBE <table>;` before writing a migration.

### 6.3 Recipes

All of these go inside `up` / `down` and use `queryInterface` ([Sequelize documentation](https://sequelize.org/docs/v6/other-topics/query-interface/)).

**Create a table**

```js
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('example', {
    id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    code: { type: Sequelize.STRING, allowNull: false, unique: true },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
},
async down(queryInterface) {
  await queryInterface.dropTable('example');
},
```

**Add an index** (mirror it in the model's `indexes` option, as `Organization.ts` does)

```js
async up(queryInterface) {
  await queryInterface.addIndex('report', ['user_id', 'created_at'], { name: 'report_user_id_created_at_idx' });
},
async down(queryInterface) {
  await queryInterface.removeIndex('report', 'report_user_id_created_at_idx');
},
```

**Fix or move data** (a *data migration*). Take a backup first ([section 11](#11-backups-and-restore)).

```js
async up(queryInterface) {
  await queryInterface.sequelize.query("UPDATE organization SET country_code = UPPER(country_code)");
},
async down() {
  // the old values cannot be recovered, say so instead of leaving this empty
  throw new Error('Irreversible data migration: restore from backup.');
},
```

**Add a NOT NULL column to a table that already has rows.** Give it a default, or add it as nullable, fill it, then make it NOT NULL in a later migration. A plain NOT NULL column without default fails on existing rows.

**Rename or remove a column.** Do it in steps over separate deployments ([rule 9](#7-team-rules)): first add the new column and copy the data, then switch the code to the new column and deploy, and only then drop the old column in a later migration.

### 6.4 Writing good migrations

- **One concern per migration.** Because MariaDB cannot roll back, a small migration that fails leaves little to clean up.
- **Name the file after what it does:** `add-description-to-report`, not `update1`.
- **Write a real `down`**, or throw an error that says why it is impossible.
- **Do not import models or application code** into a migration. The model changes over time, the migration must keep meaning the same thing forever. Use `queryInterface` and plain SQL.
- **Never edit a migration that has been merged.** Add a new one that corrects it.
- The ESLint rules apply to `db/**/*.js` (semicolons are required).

### 6.5 If a migration fails halfway

The part that ran stays applied, and the migration is **not** recorded in `SequelizeMeta`. On your local database, the easiest fix is [Start from scratch](#44-variations). On a shared database, stop and ask: look at what was applied, either revert it by hand or restore the backup, fix the migration in a **new** commit (it was never recorded, but another environment may have run it successfully), and run again.

### 6.6 Writing schema changes before Phase 4b

Until Phase 4b is merged, `sync()` still builds every table from the models on each start. A migration that only says "add column X" would find the column already there and fail. A schema change that reaches `dev` in this period therefore gets a migration that **checks first and skips** what exists. The baseline is not regenerated for it: the baseline stays the 24 tables it was made from, because regenerating it would break the "all 24 tables exist" test for databases built before the change.

Rules for such a migration:

- check with `queryInterface.showAllTables()` and `describeTable()` before every create or add, and log what was skipped;
- use SQL that matches what `sync()` generates (build it in a scratch database and dump it, [8.3](#83-regenerating-the-baseline) steps 1 to 3), including the column position;
- only add things (a table, a nullable column), so the previous version of the app keeps working;
- prove it with the drift check in [8.4](#84-checking-for-schema-drift) (expected: `SCHEMAS IDENTICAL`), and run `migrate:undo` then `migrate` once;
- seed data for new lookup tables stays in `addDataToAllTables()`. The migration creates the table, it does not fill it.

Example: `db/migrations/20261116101512-add-report-status.js` (table `report_status` and nullable column `report.report_status_id` with index and foreign key). Tested on a database built by migrations only (both parts added), on one built by `sync()` (both skipped), and with undo and redo. Its `down` drops the column and the table, so the status of existing reports and the status rows are lost.

---

## 7. Team rules

1. **A schema-changing model edit ships with a migration in the same pull request.**
2. **Never edit a merged migration.** Add a new one.
3. **One concern per migration**, named for what it does.
4. **Write a `down`**, or explain in the migration why none is possible.
5. **Never run `migrate:undo` or delete the database on a shared environment.**
6. **Back up before any migration that deletes or rewrites data.**
7. **Seed data stays in `addDataToAllTables()`.** Removing or renaming a seeded row needs a data migration, because saved reports refer to those rows.
8. **`sync()` is allowed only on scratch databases** (`scripts/sync-schema.ts` enforces this).
9. **A migration must work with the previous version of the application.** During a deployment the old and the new version of the app can run at the same time. Adding things is safe (a table, a nullable column, an index). Removing or renaming something needs two steps in two deployments.

---

## 8. The baseline migration in detail

### 8.1 What it is

The first migration, `<timestamp>-baseline.js`, represents **the schema as it was when migrations were introduced**. Instead of hand-writing about 200 lines of JavaScript that would have to match the models exactly, the schema is **generated from the real models**:

1. `sync()` builds the tables on a scratch database (`scripts/sync-schema.ts`);
2. `mariadb-dump --no-data` dumps the structure;
3. `scripts/clean-baseline.js` removes noise and writes `db/baseline.sql`;
4. the baseline migration runs that SQL.

This avoids translation mistakes. For example, the `duration` table has the columns `lowerlimit` and `upperlimit` (not `lower_limit`): the generated schema simply has what the models have.

### 8.2 How it behaves

| The database... | What `npm run migrate` does |
|---|---|
| is empty | Creates the 24 tables |
| already has all 24 tables (built earlier by `sync()`, as the existing Azure and Rahti databases were) | Does nothing to them and only records the baseline in `SequelizeMeta`. Log: `Baseline: schema already present, skipping` |
| has some but not all of the tables | **Stops with an error** that lists the present and the missing tables. Someone must look at it. |

The list of expected tables is read from `db/baseline.sql` itself, so it cannot go out of sync with the SQL. The SQL statements run inside one transaction object only to keep them on **one database connection**: `SET FOREIGN_KEY_CHECKS=0` is a per-connection setting and is needed because the dump lists tables alphabetically, so a foreign key often points to a table that does not exist yet. The check is switched back on afterwards. (The transaction gives no rollback, see [1.5](#15-one-limitation-you-must-know).)

`down` throws an error on purpose: undoing the baseline would drop the whole schema.

### 8.3 Regenerating the baseline

> **Only allowed until Phase 4b is merged and the baseline has run on a shared database.** After that the baseline is history: never regenerate it, add normal migrations instead ([rule 2](#7-team-rules)).

Regeneration is needed if a model changed the schema after the baseline was generated and before Phase 4b was merged. From the moment the baseline is generated until Phase 4b is merged, schema-changing model changes should wait, or the baseline must be regenerated before the merge.

All commands run in the project root, with the database container running.

**1. Create a scratch database as root, and give your app user access.** Open a root shell in the container:

```bash
docker exec -it hh_secur_db_container sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD"'
```

and run (replace `hh_secur_user` with your `DB_USERNAME`):

```sql
CREATE DATABASE IF NOT EXISTS hh_secur_baseline;
GRANT ALL PRIVILEGES ON `hh\_secur\_%`.* TO 'hh_secur_user'@'%';
FLUSH PRIVILEGES;
```

This is needed because the app user can normally only reach its own database. The grant covers every database whose name starts with `hh_secur_`.

**2. Build the schema from the models on that database.** The script refuses any database name without `baseline` or `drift`.

```bash
DB_DATABASE=hh_secur_baseline npx tsx scripts/sync-schema.ts
```

PowerShell: `$env:DB_DATABASE = "hh_secur_baseline"; npx tsx scripts/sync-schema.ts` (and afterwards `Remove-Item Env:DB_DATABASE`).

Expected last line: `sync() finished on "hh_secur_baseline": 25 tables` (or more, if later migrations added tables). `db/baseline.sql` itself stays at 24 tables, see [6.6](#66-writing-schema-changes-before-phase-4b).

**3. Dump it inside the container.** Do **not** use `>` in PowerShell here: Windows PowerShell 5.1 writes UTF-16, which corrupts the SQL.

```bash
docker exec hh_secur_db_container sh -c 'mariadb-dump --compact --no-data -uroot -p"$MARIADB_ROOT_PASSWORD" hh_secur_baseline > /tmp/baseline.raw.sql'
docker cp hh_secur_db_container:/tmp/baseline.raw.sql baseline.raw.sql
```

**4. Clean it into `db/baseline.sql`, then delete the raw file.**

```bash
node scripts/clean-baseline.js baseline.raw.sql db/baseline.sql
```

The cleaner removes the conditional `/*!40101 ... */` comment lines, the `AUTO_INCREMENT=<n>` table option, and `DEFAULT CHARSET` / `COLLATE` (so tables use the server's default exactly as `sync()` did; the MariaDB 12 default collation `utf8mb4_uca1400_ai_ci` does not exist on every server). Nothing else is changed. **Do not edit `db/baseline.sql` by hand.**

**5. Prove it** with the drift check below.

### 8.4 Checking for schema drift

"Drift" means the migrations and the models describe different schemas. To check, build one database from the models and one from the migrations and compare them.

Create two empty scratch databases first (`hh_secur_baseline` and `hh_secur_migrated`, with the commands of step 1 in 8.3, once for each name). Then:

```bash
# database A: built from the models
DB_DATABASE=hh_secur_baseline npx tsx scripts/sync-schema.ts
# ...and let the migration tool record the baseline there (it skips, the tables exist).
# Without this, A lacks the SequelizeMeta table and shows up as a difference.
DB_DATABASE=hh_secur_baseline npm run migrate

# database B: built only from migrations
DB_DATABASE=hh_secur_migrated npm run migrate

# compare (the script runs inside the container)
docker cp scripts/schema-diff.sh hh_secur_db_container:/tmp/schema-diff.sh
docker exec hh_secur_db_container sh /tmp/schema-diff.sh hh_secur_baseline hh_secur_migrated
```

In PowerShell set the variable first (`$env:DB_DATABASE = "hh_secur_baseline"`) and run the `npx` / `npm` command on the next line, and remove it afterwards with `Remove-Item Env:DB_DATABASE`.

Expected: `SCHEMAS IDENTICAL`. Otherwise the script prints the differences and exits with an error. It compares the structure only (tables, columns, keys, indexes), not the data. To start a comparison over, drop the two scratch databases and create them again.

This check is also the planned content of a CI job (Phase 6), which would fail any pull request that changes a model without a migration.

---

## 9. Seed data and migrations

### 9.1 Where it lives

The fixed data is inserted by `addDataToAllTables()` (`src/utils/utils.ts`), called from `src/index.ts` after the database connection works. It creates the default user and admin, the extra users, and then the option lists, countries (about 179) and organizations (about 330). Most of it uses an *upsert* pattern: look the row up by `code`, update it if it exists, otherwise create it.

### 9.2 Known problems that appear as soon as data persists

The seed code was written for an empty database. Once `drop()` is removed (Phase 4b) it runs against real data on every start. These problems were found and **measured** (running the seed twice on a migrated database). Items 1 and 2 were fixed in Phase 4a (2026-11-16), items 3 and 4 are decisions and rules:

1. **Organizations lost their country link on every restart. Fixed.** In `src/controllers/populateDatabaseController.ts`, `addOrganizationsLimited` set `organization.countryId = null` for existing rows, and only `createOrganization` linked the country again. Measured: after the first run 330 of 331 organizations had a `country_id`, after the second run **none** had. Now the update branch looks the country up by `country_code` and keeps the link.
2. **Country seeding was not awaited. Fixed.** `country.save()` and `repository.createCountry(...)` in `src/utils/countryData.ts` had no `await`, so errors became unhandled rejections, which stop a Node process, and organizations could be seeded before their countries existed. Both calls are now awaited. A failing country save now stops the seeding and is logged by `src/index.ts`.
3. **The seed overwrites edits. Decision: option A (the code is the source of truth).** Countries and seeded organizations are rewritten from the code at every start, so a change made through `PATCH /countries/{id}` or `PATCH /organizations/{id}` **is lost at the next restart**. Tell admins. This is today's behavior, so nothing changed in the code. The alternative, option B (the seed only inserts missing rows, so edits survive, but changing a seeded value later needs a data migration), can be chosen later if the team wants it.
4. **Seeded rows are never deleted.** Removing or renaming a seeded row (a `code`) needs a data migration, because saved reports refer to those rows by id.

### 9.3 Rules

- Seed data stays in `addDataToAllTables()`. Do not put it in migrations or in CLI seeders (`db/seeders` is configured but unused).
- Anything that must be *removed or renamed* in seeded data is a data migration.
- The seed must be safe to run on every start: it may insert and update seeded rows, it must never delete rows or clear columns that the application or its users own (for example `country_id`).

### 9.4 Testing the seed

`scripts/test-seed.ts` runs `addDataToAllTables()` twice on a **scratch** database, with a manually added organization present, and checks that every seeded organization whose country exists still has its `country_id`, that the manual organization is unchanged, and that no error was logged. It refuses to run unless the database name contains `scratch`, `baseline` or `drift`, and it can be run repeatedly.

```bash
# 1. As root (the password is MARIADB_ROOT_PASSWORD from .env, already inside the container), create the
#    scratch database and give the app user access.
docker exec hh_secur_db_container sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS hh_secur_scratch_seed; GRANT ALL ON hh_secur_scratch_seed.* TO \`$MARIADB_USER\`@\`%\`;"'

# 2. Build the schema with migrations, then run the test.
DB_DATABASE=hh_secur_scratch_seed npm run migrate
DB_DATABASE=hh_secur_scratch_seed npx tsx scripts/test-seed.ts | tail -5
```

PowerShell: set `$env:DB_DATABASE = "hh_secur_scratch_seed"` first. The output is very long, because Sequelize logs every query, so look at the last lines: `PASSED: ...` or `FAILED:` with the reasons. Run it after any change to the seed code.

---

## 10. Shared environments and deployment

### 10.1 What exists today

- **Azure (dev):** `.github/workflows/azure-backend-dev.yml` builds the Docker image and updates the Azure Container App `hh-secur-be-dev` (resource group `hh-secur-i-rg`) on every push to `dev`. The workflow only swaps the image. How the app gets its database settings is not visible in this repository; it is presumably configured on the container app itself. Support for `DB_SSL=true` was added to the code for it.
- **Rahti:** used as a shared environment too. Its deployment configuration is not in this repository. Credentials are in the team's Teams channel (DevOps > Shared).
- Neither environment has been switched to migrations. They run the old behavior.

### 10.2 What the switch-over will do (planned, Phases 4b and 5)

1. **Back up** the database ([section 11](#11-backups-and-restore)) and test the restore.
2. Remove `drop()` and `sync()` from `src/index.ts`. Keep `authenticate()` and the seeding, in two separate `try/catch` blocks, so a forgotten migrate gives the message "Seeding failed. Did you run `npm run migrate`?".
3. Change the Dockerfile to `CMD ["sh", "-c", "npm run migrate && npm start"]`. If the migration fails the container exits instead of running on the wrong schema.
4. **Pin the Azure container app to one replica**, because the CLI has no locking:

   ```bash
   az containerapp update --name hh-secur-be-dev --resource-group hh-secur-i-rg --min-replicas 1 --max-replicas 1
   ```

5. Deploy. In the logs look for `Baseline: schema already present, skipping`, and check that `SequelizeMeta` has one row. The existing tables are untouched.
6. **Persistence test:** create a report, restart the server twice and check that the report is still there, that seeded organizations still have their `country_id`, then trigger a second deployment and check again.
7. Repeat for the next environment.

During an Azure deployment the new revision starts while the old one is still serving. The migration runs in the new one, so for a short time the old code sees the new schema. This is why [rule 9](#7-team-rules) exists.

### 10.3 Open questions for the team

See [section 13](#13-decisions-findings-and-open-questions). The most important one: **are the Azure and Rahti databases on persistent storage?** If not, fix that first, otherwise the switch-over will not keep data anyway.

---

## 11. Backups and restore

Take a backup before any migration that deletes or rewrites data, and before the switch-over of every shared environment. **A backup that has never been restored is not a backup:** restore it into a scratch database once to prove it works.

Local Docker database (works in bash and PowerShell, the redirect happens inside the container):

```bash
# backup
docker exec hh_secur_db_container sh -c 'mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" hh_secur > /tmp/backup.sql'
docker cp hh_secur_db_container:/tmp/backup.sql backup.sql

# restore into an existing, empty database
docker cp backup.sql hh_secur_db_container:/tmp/backup.sql
docker exec hh_secur_db_container sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" hh_secur_restore_test < /tmp/backup.sql'
```

Replace `hh_secur` with your `DB_DATABASE`. For a remote database use `mariadb-dump -h <host> -P <port> -u <user> -p --ssl <database>` from a machine that can reach it. Backup files contain real data and password hashes: keep them out of git and out of shared chat.

---

## 12. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `Access denied for user '...'@'localhost' (using password: NO)` | `DB_PASSWORD` is empty or `.env` is not in the project root. Set a password. If the database volume was created with an empty password, recreate it ([4.4](#44-variations), "Start from scratch"): the user was never created. |
| `Access denied ... (using password: YES)` although the password is right | On Windows/macOS/Linux another database is probably answering on port 3306. See [4.5](#45-port-3306-is-already-in-use). Otherwise you changed credentials without recreating the volume. |
| `ECONNREFUSED` / cannot connect | The database container is not running or not healthy yet: `docker compose -f docker-compose-dbbe.yaml ps`, then start it (step 3). Check `DB_HOST` and `DB_PORT`. |
| `failed to connect to the docker API ... npipe` | Docker Desktop is not running. Start it and wait until `docker info` works. |
| The database container exits immediately | `DB_USERNAME=root` (not allowed), or `MARIADB_ROOT_PASSWORD` is missing from `.env`. Fix `.env`, then "Start from scratch". |
| `Unable to find migrations path` / config not found | You are not in the project root. `.sequelizerc` is read from the current directory. |
| `Baseline: the database has only some of the 24 tables` | The database is half built, for example from an interrupted run. Locally: "Start from scratch". On a shared database: do not touch it, ask the team, restore from backup. |
| `The baseline cannot be undone` | Expected. `migrate:undo` refuses on the baseline. |
| `Table '...' already exists` or `Duplicate column name` when a new migration runs | The old server (`drop()` + `sync()`) already built that table or column from the models. This is why real migrations wait for Phase 4b ([why](#why-not-yet)). Locally: "Start from scratch", then run `npm run migrate` **before** starting the server. |
| `syntax error` mentioning strange characters like `ÿþ` in `baseline.sql` | The dump was written with PowerShell `>` (UTF-16). Redo step 3 of [8.3](#83-regenerating-the-baseline) with the redirect inside the container. |
| `sh: ... not found` or `\r` errors when running `schema-diff.sh` | The file got Windows line endings. `.gitattributes` prevents this for new checkouts. Re-checkout the file, or run `git add --renormalize .`. |
| `npm run migrate:new -- name` does nothing or ignores the name | The `--` before the name is missing. |
| The server keeps resetting my data | Expected until Phase 4b: `drop()` + `sync()` still run on start ([section 2](#2-status-and-roadmap)). |

---

## 13. Decisions, findings and open questions

### 13.1 Decisions

| Decision | Reason / consequence |
|---|---|
| Sequelize-CLI as the migration tool | Standard tool of the library already in use. No locking, so the cloud app runs a single replica. (An early report had suggested Umzug.) |
| Plain `.js` migrations in `db/migrations/` | The project is CommonJS and the CLI loads `.js` directly, no build step |
| The baseline is **generated** from the models, not hand-written | No translation mistakes, no drift between baseline and models |
| The baseline skips itself if all 24 tables exist | The existing Azure and Rahti databases need no manual `SequelizeMeta` edits |
| Seed data stays in `addDataToAllTables()` | Keeps one place for fixed data; needs the fixes in [9.2](#92-known-problems-that-appear-as-soon-as-data-persists) |
| `sequelize-cli` is a dev dependency | The Dockerfile runs a full `npm ci` |
| `@sequelize/mariadb` was removed | It was an unused alpha package, not imported anywhere |
| Phase 4b is the point of no return | Phases 1 to 4a are invisible to the running application |
| Seed policy A: the code is the source of truth (2026-11-16) | Seeded countries and organizations are overwritten at every start, so API edits to them do not survive a restart. Option B can be chosen later. |

### 13.2 Findings made while building this

- **The join tables already have unique keys.** `report_collaboration_type (report_id, collaboration_type_id)` and `consortium_organization (consortium_id, organization_id)` get a composite UNIQUE index automatically from Sequelize's many-to-many handling (visible in `db/baseline.sql`). The commented-out `@Index` blocks in `ReportCollaborationType.ts` and `ConsortiumOrganization.ts` were therefore redundant, and an earlier idea to add these indexes in a first real migration does not apply. Those comments can be removed. The first real migration turned out to be `add-report-status` (a table that `dev` gained after the baseline was generated).
- **MariaDB 12 dumps show the foreign keys that `sync()` created without a name as `CONSTRAINT `1``, `` `2` ``** and so on, in every table. Replaying that SQL works (verified), no action needed.
- **Timestamp column naming is inconsistent** (20 tables `createdAt`, 4 tables `created_at`), see [6.2](#62-worked-example-hypothetical). Fixing it would be a (large) migration of its own.
- `drop()` leaves `SequelizeMeta` alone (it is not a model), verified.
- Other problems, outside the scope of migrations but worth tickets: `/defaultuser`, `/defaultadmin` and `/testcode` have no `authenticate`, which matters more once data persists; the default users' passwords are overwritten from the environment on every start; the model name `HHRole ` has a trailing space; typos such as `AddEthicsAssessmentRepoitory` and `Succsefully`; `report_snapshot` text columns are `VARCHAR(255)`.

### 13.3 Open questions (need an owner)

1. Are the **Azure and Rahti databases on persistent storage?**
2. **Who runs migrations** on shared environments? Proposal: the container runs them automatically on start (Phase 4b).
3. After Phase 4b, keep an **opt-in old mode** (an environment flag that still runs `drop()` + `sync()`, ignored unless the host is local), or a hard cutover? The recommendation is the hard cutover, with a manual reset procedure for local databases.
4. ~~**Seed overwrite policy** for countries and organizations~~ Chosen: option A (see [13.1](#131-decisions)). The team can revisit it.
5. Should the default users' passwords keep being overwritten from the environment on every start?

---

## 14. Glossary and further reading

| Term | Meaning |
|---|---|
| **Migration** | A file with `up` and `down` that changes the database structure by one step |
| **Baseline** | The first migration, the schema as it was when migrations started |
| **`SequelizeMeta`** | The table where the database records which migrations have run |
| **Model** | A TypeScript class describing how the code sees a table |
| **`sync()`** | A Sequelize function that creates tables from models. Allowed on scratch databases only. |
| **`drop()`** | A Sequelize function that deletes all model tables |
| **Seed data** | Fixed content inserted by `addDataToAllTables()` |
| **Scratch database** | A throwaway database for generating or checking the schema (name contains `baseline` or `drift`) |
| **Drift** | Models and migrations describing different schemas |
| **Data migration** | A migration that changes data, not structure |
| **Point of no return** | Phase 4b: after it the schema only changes through migrations |

Further reading:

- Sequelize migrations guide: <https://sequelize.org/docs/v6/other-topics/migrations/>
- Sequelize `queryInterface` reference: <https://sequelize.org/docs/v6/other-topics/query-interface/>
- Table descriptions and the relational model of this project: [database_model.md](database_model.md)
- Docker Compose guide and environment variables: the root [README.md](../README.md)
