const knex = require("knex");

class MovieNotesController {
  async create(req, res) {
    try {
      const { title, description, rating, movie_tags } = req.body;
      const { user_id } = req.params;
  
      console.log("Dados recebidos:", req.body);
  
      const [note_id] = await knex("movie_notes").insert({
        title: title,
        description: description,
        rating: rating,
        user_id: user_id
      });
  
      console.log("ID da nota inserida:", note_id);
  
      const tagsInsert = movie_tags.map((name) => {
        return {
          note_id: note_id,
          name: name,
          user_id: user_id
        }
      });
  
      console.log("Tags para inserir:", tagsInsert);
  
      await knex("movie_tags").insert(tagsInsert);
  
      console.log("Tags inseridas com sucesso.");
  
      res.json();
  
    } catch (e) {
      console.error("Erro:", e);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  
}

module.exports = MovieNotesController;