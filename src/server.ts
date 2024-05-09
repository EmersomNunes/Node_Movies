import express, { NextFunction, Request, Response, json, response } from "express";
import { routes } from "./Routes";
import "express-async-errors";
import { migrationsRun } from "./database/sqlite/migrations";
import { ErrorApp } from "../utils/ErrorApp";

const app = express();
app.use(express.json());

migrationsRun();

app.use(routes);

app.use((error: ErrorApp, request: Request, response: Response, next: NextFunction) => {
  if(error instanceof ErrorApp) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.log(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
})

const PORT: number = 3000;
app.listen(PORT, () => console.log(`Server is running in Port ${PORT}`));