import express from "express";
import verifyToken from "../middleware/validate";
import { AuthController } from "../controllers/AuthControllers";
import { RegisterController } from "../controllers/RegisterControllers";
import { HomeController } from "../controllers/HomeControllers";
import { TaskController } from "../controllers/TaskControllers";

const router = express.Router();

//Welcome
router.get("/", async (req, res) => {
  res.render("begin");
});
//Login
router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/logout", AuthController.logout);
router.post("/login", AuthController.login);
//Registration
router.get("/registro", async (req, res) => {
  res.render("registro");
});
router.post("/registro", RegisterController.register);

//Home
router.get("/inicio", verifyToken, HomeController.home);
router.post("/inicio", verifyToken, TaskController.home_post);

//Update
router.get("/actualizar/:id", TaskController.actualizar);
router.post("/actualizar/:id", TaskController.actualizar_post);

//Delete
router.get("/eliminar/:index", TaskController.delete);

//Done
router.post("/terminada/:id/false", TaskController.done_false);
router.post("/terminada/:id/true", TaskController.done_true);

module.exports = router;
