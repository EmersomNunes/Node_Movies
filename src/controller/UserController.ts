import { Request, Response } from "express";
import { sqliteConnection } from "../database";
import { hash } from "bcryptjs";
import { ErrorApp } from "../../utils/ErrorApp";
import { Database } from "sqlite";
export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const database: Database = await sqliteConnection();

      const checkEmailExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

      if (checkEmailExist) {
        throw new Error;
      };

      const hashPassword = await hash(password, 10);

      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashPassword]
      );

      return res.status(201).json();
    } catch (e) {
      res.json(new ErrorApp("Este e-mail já está em uso"));
    };
  };
};