const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');

const mainRouter = require("./Routes/MainRoute");

const path = require("path");
const app = express();
const port = 8080;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", mainRouter);

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://${"127.0.0.1"}:${port}/`);
});
