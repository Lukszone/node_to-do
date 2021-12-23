import * as jwt from "jsonwebtoken"

const verifyToken = (req,res, next)=>{
	const token = req.session.token
	if(!token){
		return res.redirect("/login")
	}
	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET)

		if(!verified){
			return res.redirect("/login")
		}

		next()
	} catch (error) {
		res.send("Token invalido")
	}
}
export default verifyToken;