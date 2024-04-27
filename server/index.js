const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');

//Routers section
const mainRouter = require("./Routes/MainRoute");
const gameRouter = require("./Routes/GameRoute");

const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", mainRouter);
app.use("/game", gameRouter);

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://${"127.0.0.1"}:${port}/`);
});