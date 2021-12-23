import * as fs from "fs";
import { v4 as uuid4 } from "uuid";

//crear
export const TaskController = {
  async home_post(req, res) {
    try {
      let tarea = req.body.tarea;
      let user_ID = req.session.user_id;
      let tasks = fs.readFileSync("./task.json");
      tasks = JSON.parse(tasks);
      
      await tasks.tasks.push({
        id: uuid4(),
        tarea: tarea,
        done: false,
        user_id: req.session.user_id,
      });
      let filterTask = tasks.tasks.filter((task) => task.user_id === user_ID);

      fs.writeFileSync("./task.json", JSON.stringify(tasks));

      res.render("home", {
        tasks: filterTask,
      });
    } catch (e) {
      console.log(e);
      res.json({ message: "error" });
    }
  },
  //actualizar
  async actualizar(req, res) {
    let { id } = req.params;
    let tasks = fs.readFileSync("./task.json");
    tasks = await JSON.parse(tasks);
      console.log(id)
    let [task] = tasks.tasks.filter((task) => task.id === id);
    if (!task) {
      res.redirect("/inicio");
    }
    res.render("actualizar", {
      task,
    });
  },
  async actualizar_post(req, res) {
    let { id } = req.params;
    let tasks = fs.readFileSync("./task.json");
    tasks = JSON.parse(tasks);
    tasks = tasks.tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          tarea: req.body.tarea,
          id,
          done: false,
        };
      }
      return task;
    });

    fs.writeFileSync("./task.json", JSON.stringify({ tasks }));
    res.redirect("/inicio");
  },
  //borrar
  async delete(req, res) {
    let { index } = req.params;
    index = parseInt(index);
    let tasks = fs.readFileSync("./task.json");
    tasks = JSON.parse(tasks)
  
    let taskDelete = {
      tasks: [
      ...tasks.tasks.slice(0, index),
      ...tasks.tasks.slice(index + 1)
      ],
    };
    fs.writeFileSync("./task.json", JSON.stringify(taskDelete));
    res.redirect("/inicio");
  },
  //terminada
  async done_false(req, res) {
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
  },
  async done_true(req, res) {
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
  },
};
