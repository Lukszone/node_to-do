import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import morgan from "morgan";

const router = require("./routes");

const app = express();

app.engine(
  '.hbs', 
  engine({
    extname: '.hbs',
    defaultLayout: "main",
    layoutsDir: 
    path.join(__dirname, "views", "layout"),
  })
);
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.static(path.join(
  __dirname, 'public'
  )
));
app.use(express.urlencoded({
  extended:true
}));
app.use(express.json());
app.use(router);


app.listen(5000, () => {
  console.log("Server running in port 5000");
});