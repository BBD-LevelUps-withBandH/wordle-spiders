var express = require("express")
const path = require("path");
const { join } = require("path");
const gameRouter = express.Router();

gameRouter.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../frontend/Views/game.html'));
  });

module.exports = gameRouter;