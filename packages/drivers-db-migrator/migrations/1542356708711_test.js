exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(
      `
    CREATE TABLE IF NOT EXISTS test
    (
        some_id bigserial NOT NULL,
        PRIMARY KEY (some_id)
    );
    `
    ),
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.raw(`DROP TABLE IF EXISTS test;`)])
}
