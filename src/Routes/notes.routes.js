const Router = require("express");
const MovieNotesController = require("../controller/MovieNotesCrontroller");

const notesRouter = Router();
const notesController = new MovieNotesController();

notesRouter.post("/:user_id", notesController.create);

module.exports = notesRouter;