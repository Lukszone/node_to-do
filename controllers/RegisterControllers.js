import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";


export const RegisterController = {
  async register(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      let users = fs.readFileSync("./users.json");
      users = JSON.parse(users);

      let existUser = users.filter((user) => user.email === email);

      if (existUser.length > 0) {
        res.render("registro", {
          error: true,
          message: "Email invalido",
        });
      }

      const user_new = {
        email: email,
        password: await bcrypt.hash(password, 12),
        id: uuid4()
      }
      await users.push(user_new);

      fs.writeFileSync("./users.json", JSON.stringify(users));

      //creando token
		  const token = jwt.sign(
        {
          id: user_new.id
        },
        process.env.TOKEN_SECRET
      );

      req.session.user_id = user_new.id;
      req.session.token = token
      res.redirect("/inicio");
    } catch (e) {
      console.log(e);
      res.json({ message: "error" });
    }
  },
};
