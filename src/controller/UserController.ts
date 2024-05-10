import { Request, Response } from "express";
import { sqliteConnection } from "../database/sqlite/index";
import { compare, hash } from "bcryptjs";
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

      return res.status(201).json("Usuário criado com sucesso!");
    } catch (e) {
      res.json(new ErrorApp("Este e-mail já está em uso"));
    };
  };

  async update(req: Request, res: Response) {
    try{
      const { name, email, password, old_password } = req.body;
      const { id } = req.params;

      const database = await sqliteConnection();

      const user = await database.get(
        "SELECT * FROM users WHERE id = (?)", [id]
      );

      if(!user) {
        throw new ErrorApp("Usuário não encontrado");
      }

      const userWithUpdatedMail = await database.get(
        "SELECT * FROM users WHERE email = (?)", [email]
      );

      if(userWithUpdatedMail && userWithUpdatedMail.id !== user.id) {
        throw new ErrorApp("Este e-mail já está cadastrado.")
      }

      user.name = name ?? user.name;
      user.email = email ?? user.email;

      if(password && !old_password) {
        throw new ErrorApp("Informe sua senha antiga para prosseguir");
      }

      if(password && old_password) {
        const checkOldPassword = await compare(old_password, user.password);

        if(!checkOldPassword){
          throw new ErrorApp("A senha antiga está incorreta.");
        }

        user.password = await hash(password, 8);
      }

      await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`, [user.name, user.email, user.password, id]
      );

      return res.json("Usuário atualizado com sucesso");

    }catch(e) {
      console.log(e);
      res.status(400).json();
    }
  }
};