import express from "express";
import { engine } from "express-handlebars";
import path from "path";
const app = express();

// app.engine(
app.engine('handlebars', 
  engine({
    extname: '.hbs',
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layout"),
  }));
app.set('view engine', 'hbs');


app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const router = require("./routes");
app.use(router);
app.listen(3000, () => {
  console.log("Server running in port 3000");
});
