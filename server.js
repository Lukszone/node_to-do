import express from "express";
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:false}));
app.use(express.json())
const router = require("./routes");
app.use(router);
app.listen(4000, () => {
  console.log("Server running in port 4000");
});
