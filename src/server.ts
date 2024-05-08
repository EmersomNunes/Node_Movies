import express, { Request, Response } from "express";
import { routes } from "./Routes";

const app = express();

app.get("/", (request: Request, response: Response) => {
  response.send("Olá, testando")
});

app.use(routes);
const PORT: number = 3000;
app.listen(PORT, () => console.log(`Server is running in Port ${PORT}`));