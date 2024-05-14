const Router = require("express")
const UserController = require("../controller/UserController");

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", userController.create);
userRouter.put("/:id", userController.update);
userRouter.get("/:id", userController.show);

module.exports = userRouter;