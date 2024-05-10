import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("movie_tags", table => {
    table.increments("id");
    table.integer("note_id").references("id").inTable("movie_notes");
    table.integer("user_id").references("id").inTable("users");
    table.text("name");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("movie_tags");
}

