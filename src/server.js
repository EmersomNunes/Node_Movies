const express = require("express");
const routes = require("./Routes")
"express-async-errors";
const migrationsRun = require("./database/sqlite/migrations")
const ErrorApp = require("../utils/ErrorApp")

const app = express();
app.use(express.json());

migrationsRun();

app.use(routes);

app.use((error, request, response, next) => {
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

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running in Port ${PORT}`));