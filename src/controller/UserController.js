const sqliteConnection = require("../database/sqlite/index")
const { compare, hash } = require("bcryptjs");
const ErrorApp = require("../../utils/ErrorApp")

class UserController {
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      const database = await sqliteConnection();

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

  async update(req, res) {
    try {
      const { name, email, password, old_password } = req.body;
      const { id } = req.params;

      const database = await sqliteConnection();

      const user = await database.get(
        "SELECT * FROM users WHERE id = (?)", [id]
      );

      if (!user) {
        throw new ErrorApp("Usuário não encontrado");
      }

      const userWithUpdatedMail = await database.get(
        "SELECT * FROM users WHERE email = (?)", [email]
      );

      if (userWithUpdatedMail && userWithUpdatedMail.id !== user.id) {
        throw new ErrorApp("Este e-mail já está cadastrado.")
      }

      user.name = name ?? user.name;
      user.email = email ?? user.email;

      if (password && !old_password) {
        throw new ErrorApp("Informe sua senha antiga para prosseguir");
      }

      if (password && old_password) {
        const checkOldPassword = await compare(old_password, user.password);

        if (!checkOldPassword) {
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

    } catch (e) {
      console.log(e);
      res.status(400).json();
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const database = await sqliteConnection();

      const user = await database.get(
        "SELECT * FROM users WHERE id = ?", [id]
      );

      if (!user) {
        throw new ErrorApp("Usuário não encontrado");
      }

      return res.json({
        name: user.name,
        avatar: user.avatar,
        created_at: user.created_at
      });
    } catch (e) {
      return res.json(e)
    };
  };
};

module.exports = UserController;