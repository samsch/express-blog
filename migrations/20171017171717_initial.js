'use strict';
exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('author', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('email');
      table.string('password');
      table.timestamps(true, true);
    })
    .then(() => {
      return knex.schema.createTableIfNotExists('post', table => {
        table.increments('id').primary();
        table.string('title');
        table
          .integer('author')
          .unsigned()
          .references('id')
          .inTable('author');
        table.timestamps(true, true);
        table.text('post');
      });
    })
    .then();
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('post').then(() => {
    knex.schema.dropTableIfExists('author').then();
  });
};
