// const express = require("express");
// const bodyParser = require("body-parser");
// const http = require('http');

// const mainRouter = require("./Routes/MainRoute");

// const path = require("path");
// const app = express();
// const port = 5000;

// app.use(bodyParser.json({ limit: "100mb" }));
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/", mainRouter);

// let server = http.createServer(app);

// server.listen(port, () => {
//   console.log(`Server running at http://${"127.0.0.1"}:${port}/`);
// });


const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "../frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "main.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
