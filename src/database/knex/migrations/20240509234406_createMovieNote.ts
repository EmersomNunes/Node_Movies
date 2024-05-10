import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("movie_notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.text("rating");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("movie_notes");
}
