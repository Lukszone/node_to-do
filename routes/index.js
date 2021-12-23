const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
import * as fs from "fs";
import { v4 as uuid4 } from "uuid";

//login
router.get("/", async (req, res) => {
  res.render("begin");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
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
  const [userDB] = getUser
  const isEqual = await bcrypt.compare(password, userDB.password)
  
  if(!isEqual){
    return res.render("login", {
      error: true,
      message: "Vuelva a revisar sus datos",
    });
  }
  res.redirect("/inicio");
});

router.get("/registro", async (req, res) => {
  res.render("registro");
});

router.post("/registro", async (req, res) => {
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
    await users.push({
      email: email,
      password: await bcrypt.hash(password, 12),
    });
    fs.writeFileSync("./users.json", JSON.stringify(users));
    res.render("login");
  } catch (e) {
    console.log(e);
    res.json({ message: "error" });
  }
});

//tareas
router.get("/inicio", async (req, res) => {
  let tasks = fs.readFileSync("./task.json");
  tasks = await JSON.parse(tasks);

  res.render("home", {
    tasks: tasks.tasks,
  });
});

router.post("/inicio", async (req, res) => {
  try {
    var tarea = req.body.tarea;
    let tasks = fs.readFileSync("./task.json");
    tasks = JSON.parse(tasks);

    await tasks.tasks.push({ id: uuid4(), tarea: tarea, done: false });

    fs.writeFileSync("./task.json", JSON.stringify(tasks));

    res.render("home", {
      tasks: tasks.tasks,
    });
  } catch (e) {
    console.log(e);
    res.json({ message: "error" });
  }
});

router.get("/actualizar/:id", async (req, res) => {
  let { id } = req.params;
  let tasks = fs.readFileSync("./task.json");
  tasks = await JSON.parse(tasks);

  let [task] = tasks.tasks.filter((task) => task.id === id);
  if (!task) {
    res.redirect("/inicio");
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

  fs.writeFileSync("./task.json", JSON.stringify({ tasks }));
  res.redirect("/inicio");
});

router.get("/eliminar/:index", async (req, res) => {
  let { index } = req.params;
  index = parseInt(index);
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);

  let taskDelete = {
    tasks: [...tasks.tasks.slice(0, index), ...tasks.tasks.slice(index + 1)],
  };
  fs.writeFileSync("./task.json", JSON.stringify(taskDelete));
  res.redirect("/inicio");
});

router.post("/terminada/:id/false", async (req, res) => {
  let { id } = req.params;
  let tasks = fs.readFileSync("./task.json");
  tasks = JSON.parse(tasks);

  let mod_tasks = await tasks.tasks.map((task) => {
    if (task.id == id) {
      return {
        ...task,
        done: true,
      };
    }
    return task;
  });
  fs.writeFileSync("./task.json", JSON.stringify({ tasks: mod_tasks }));
  res.redirect("/inicio");
});

router.post("/terminada/:id/true", async (req, res) => {
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
  fs.writeFileSync("./task.json", JSON.stringify({ tasks: mod_tasks }));
  res.redirect("/inicio");
});

module.exports = router;
