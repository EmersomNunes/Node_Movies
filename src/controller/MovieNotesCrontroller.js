const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response) {
    const { title, description, movie_tags, rating } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      user_id,
      rating
    });

    const tagsInsert = movie_tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });

    await knex("movie_tags").insert(tagsInsert);

    response.json();
  }
}

module.exports = MovieNotesController;