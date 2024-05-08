import { Request, Response } from "express";
export class UserController {
  create(req: Request, res: Response) {
    res.send("Usuário criado com sucesso")
  }
}