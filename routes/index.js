const express = require("express");
const router = express.Router();
import * as fs from "fs";
import { v4 as uuid4 } from "uuid";

router.get("/", async (req, res)=>{
  let tasks = 
  fs.readFileSync("./task.json");
  tasks = await JSON.parse(tasks);

  res.render("home", {
    tasks: tasks.tasks,
  });
});

router.post("/", async (req, res)=>{
  try {
    var tarea = req.body.tarea;
    let tasks =
     fs.readFileSync("./task.json");
    tasks = JSON.parse(tasks);

    await tasks.tasks.push(
      { id: uuid4(),
        tarea: tarea,
        done: false 
      });

    fs.writeFileSync("./task.json",
    JSON.stringify(tasks));

    res.render("home", {
      tasks: tasks.tasks,
    });
  }catch (e) {
    console.log(e);
    res.json(
      { message: "error" }
    );
  }
});

router.get("/actualizar/:id",async (req, res) => {
  let { id } = req.params;
  let tasks = fs.readFileSync("./task.json");
  tasks = await JSON.parse(tasks);

  let [task] = tasks.tasks.filter(
    (task) => task.id === id);
  if (!task) {
    res.redirect("/");
  }

  res.render("actualizar", {
    task,
  });
});

router.post("/actualizar/:id", async (req, res) => {
  let { id } = req.params;
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);
  tasks = tasks.tasks.map((task) => {
    if (task.id === id) {
      return {
        tarea: req.body.tarea,
        id,
        done: false,
      };
    }

    return task;
  });

  fs.writeFileSync("./task.json", JSON.stringify(
    { tasks }
  ));

  res.redirect("/");
});

router.get("/eliminar/:index", async (req, res) => {
  let { index } = req.params;
  index = parseInt(index);
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);

  let taskDelete = {
    tasks: 
    [...tasks.tasks.slice(0, index),
    ...tasks.tasks.slice(index + 1)],
  };
  fs.writeFileSync("./task.json",
  JSON.stringify(taskDelete));
  res.redirect("/");
});

router.post("/terminada/:id/false", async (req, res)=>{
  let { id } = req.params;
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);

  let mod_tasks = await tasks.tasks.map((task) =>{
    if (task.id == id) {
      return {
        ...task,
        done: true,
      };
    }
    return task;
  });
  fs.writeFileSync("./task.json",
  JSON.stringify(
    { tasks: mod_tasks }
  ));
  res.redirect("/");  
});

router.post("/terminada/:id/true",
async (req, res) => {
  let { id } = req.params;
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);

  let mod_tasks = await tasks.tasks.map((task) => {
    if (task.id == id) {
      return {
        ...task,
        done: false,
      };
    }
    return task;
  });
  fs.writeFileSync("./task.json",
  JSON.stringify(
    { tasks: mod_tasks }
  ));
  res.redirect("/");  
});

module.exports = router;
