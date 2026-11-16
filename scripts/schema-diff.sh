#!/bin/sh
# Compares the schema (tables, columns, keys, indexes) of two databases on the MariaDB server.
# Used to prove that a database built by migrations equals one built by sync() from the models.
#
# It must run INSIDE the database container, where the root password is available:
#   docker cp scripts/schema-diff.sh hh_secur_db_container:/tmp/schema-diff.sh
#   docker exec hh_secur_db_container sh /tmp/schema-diff.sh hh_secur_baseline hh_secur_migrated
#
# Prints "SCHEMAS IDENTICAL", or the differences (first 60 lines). Data is not compared.
# See docs/migrations.md, section "Checking for schema drift".
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: schema-diff.sh <database A> <database B>" >&2
  exit 2
fi

A="$1"
B="$2"

for d in "$A" "$B"; do
  mariadb-dump --compact --no-data -uroot -p"$MARIADB_ROOT_PASSWORD" "$d" > "/tmp/schema-$d.sql"
done

echo "lines: $(wc -l < "/tmp/schema-$A.sql") ($A) vs $(wc -l < "/tmp/schema-$B.sql") ($B)"

if diff "/tmp/schema-$A.sql" "/tmp/schema-$B.sql" > /tmp/schema.diff; then
  echo "SCHEMAS IDENTICAL"
else
  echo "DIFFERENCES (< is $A, > is $B):"
  head -60 /tmp/schema.diff
  exit 1
fi
