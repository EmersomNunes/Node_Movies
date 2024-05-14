const knex = require("../database/knex");
class MovieNotesController {
  async create(request, response) {
    const { title, description, movie_tags, rating } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      user_id,
      rating,
    });

    const tagsInsert = movie_tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("movie_tags").insert(tagsInsert);

    response.json();
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movie_notes").where({ id }).delete();

    res.json();
  }

  async show(req, res) {
    const { id } = req.params;

    const movie_note = await knex("movie_notes").where({ id }).first();
    const movie_tags = await knex("movie_tags")
      .where({ note_id: id })
      .orderBy("name");

    return res.json({
      ...movie_note,
      movie_tags,
    });
  }

  async index(req, res) {
    try {
      const { user_id, title, movie_tags } = req.query;

      let movie_notes;
  
      if (movie_tags) {
        const filterTags = movie_tags.split(",").map((tag) => tag.trim());
  
        movie_notes = await knex("movie_tags")
          .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
          .where("movie_notes.user_id", user_id)
          .whereLike("movie_notes.title", `%${title}%`)
          .whereIn("name", filterTags)
          .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
          .orderBy("movie_notes.title");
      } else {
        movie_notes = await knex("movie_notes")
          .where({ user_id })
          .whereLike("title", `%${title}%`)
          .orderBy("title");
      }
  
      const userTags = await knex("movie_tags").where({ user_id });
      const notesWithTags = movie_notes.map(note => {
        const noteTags = userTags.filter(tag => tag.note_id === note.id);
  
        return {
          ...note,
          tags: noteTags
        }
      });
  
      res.json(notesWithTags);
    }catch(e) {
      console.log(e)
    }
  }
}

module.exports = MovieNotesController;
