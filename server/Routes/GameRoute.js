var express = require("express")
const path = require("path");
const { join } = require("path");
const gameRouter = express.Router();

const handle_errors = (fn) => (req, res, next) => {  
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    })
};

gameRouter.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/Views/game.html'));
});

module.exports = gameRouter;