import * as fs from "fs";

export const HomeController = {
  async home(req, res) {
    let user_id = req.session.user_id;
    let tasks = fs.readFileSync("./task.json");
    tasks = await JSON.parse(tasks);

    let filterTask = tasks.tasks.filter((task) => task.user_id === user_id);

    res.render("home", {
      tasks: filterTask,
    });
  }
};
