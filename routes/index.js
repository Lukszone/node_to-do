const express = require("express");
const path = require("path");
const router = express.Router();
import * as fs from "fs";
import { v4 as uuid4 }  from "uuid";
// const tareas = require("../public/js/script")
module.exports = router;

router.get("/", function (req, res) {
  // res.sendFile(path.join(__dirname, "../views/index.hbs"));
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);
  res.render('home', {
    tasks: tasks.tasks
  })

  //res.sendFile("index.html");

  //const task = tareas.find().lean();
  //res.render("index", { tareas: task });
});
router.get(`/tarea/:id/actualizar`, (req, res) => {
res.sendFile(path.join(__dirname, "../views/actualizar.hbs"));
// let task =  
// res.render("actualizar.html", { task });
});
//router.post("/tarea/:id/", (req, res) => {
//res.sendFile(path.join(__dirname, "../views/actualizar.html"));
// const { id } = req.params;
// tareas.findByIdAndUpdate(id, req.body);
// res.redirect("/");
//});

router.post("/tarea_nueva", async (req, res) => {
  try {
    var tarea = req.body;
    let tasks = fs.readFileSync("./task.json");
    tasks = JSON.parse(tasks);
    console.log(tarea, tasks)

    tasks.tasks.push({ id: uuid4(), tarea });

    fs.writeFileSync("./task.json", JSON.stringify(tasks));

    res.json({ message: "saved" });
  } catch (e) {
    console.log(e);
    res.json({ message: "error" });
  }
});