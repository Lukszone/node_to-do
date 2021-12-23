import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

export const AuthController = {
	async login (req, res) {
		let email = req.body.email;
		let password = req.body.password;
		let users = fs.readFileSync("./users.json");
		users = JSON.parse(users);

		let getUser = users.filter((user) => user.email === email);

		if (getUser.length === 0) {
			return res.render("login", {
				error: true,
				message: "Usuario no encontrado",
			});
		}
		const [userDB] = getUser;
		const isEqual = await bcrypt.compare(password, userDB.password);

		if (!isEqual) {
			return res.render("login", {
				error: true,
				message: "Vuelva a revisar sus datos",
			});
		}

		//creando token
		const token = jwt.sign(
			{
				id: users.id
			},
			process.env.TOKEN_SECRET
		);
		
    req.session.user_id = userDB.id;
		req.session.token = token
		res.header("authorization", token)
		res.redirect("/inicio");
	},
	async logout(req, res) {
		req.session.destroy
		res.redirect('/login')
	}
}