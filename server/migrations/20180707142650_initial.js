'use strict';
exports.up = async function (knex) {
  const alreadyHasUserTable = await knex.schema.hasTable('user');
  const alreadyHasPostTable = await knex.schema.hasTable('post');
  if (alreadyHasUserTable && alreadyHasPostTable) {
    throw new Error('user and post tables already exist');
  }
  if (alreadyHasUserTable) {
    throw new Error('user table already exist');
  }
  if (alreadyHasPostTable) {
    throw new Error('post tables already exist');
  }
  await knex.schema.createTable('user', table => {
    table.increments('id').primary();
    table.text('name');
    table.text('email');
    table.text('password');
    table.timestamps(true, true);
  });
  await knex.schema.createTable('post', table => {
    table.increments('id').primary();
    table.text('title');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('user');
    table.timestamps(true, true);
    table.text('post');
  });
  return undefined;
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('post');
  await knex.schema.dropTableIfExists('user');
  return undefined;
};
