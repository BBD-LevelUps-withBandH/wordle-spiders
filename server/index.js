const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");

const mainRouter = require("./Routes/MainRoute");

const path = require("path");
const app = express();
const port = 8080;

require("dotenv").config({
  path: path.join(__dirname, "db.env"),
});

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", mainRouter);

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://${"127.0.0.1"}:${port}/`);
});
