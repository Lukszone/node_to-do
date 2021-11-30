const express = require("express");
const path = require("path");
const router = express.Router();
import * as fs from "fs";
import { v4 as uuid4 }  from "uuid";


router.get("/", async (req, res) => {
  console.log("i am here")
  // res.sendFile(path.join(__dirname, "../views/index.hbs"));
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);

  res.render('home', {
    tasks: tasks.tasks
  })

});


router.get(`/tarea/:id/actualizar`, (req, res) => {
res.sendFile(path.join(__dirname, "../views/actualizar.hbs"));
// let task =  
// res.render("actualizar.html", { task });
});


router.post("/tarea_nueva", async (req, res) => {
  try {
    var tarea = req.body.tarea;
    let tasks = fs.readFileSync("./task.json");
    tasks = JSON.parse(tasks);

    tasks.tasks.push({ id: uuid4(), tarea: tarea });

    fs.writeFileSync("./task.json", JSON.stringify(tasks));

    res.render('home', {
      tasks: tasks.tasks
    })
  } catch (e) {
    console.log(e);
    res.json({ message: "error" });
  }
});

module.exports = router;
