const Router = require("express");
const MovieNotesController = require("../controller/MovieNotesCrontroller");

const notesRouter = Router();
const notesController = new MovieNotesController();

notesRouter.post("/:user_id", notesController.create);
notesRouter.delete("/:id", notesController.delete);
notesRouter.get("/:id", notesController.show);
notesRouter.get("/", notesController.index);

module.exports = notesRouter;