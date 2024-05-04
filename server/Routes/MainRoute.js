var express = require("express")
const path = require("path");
const { join } = require("path");
const mainRouter = express.Router();
const {getHighScore, getWordsOfDay} = require('../database.queries');

const handle_errors = (fn) => (req, res, next) => {  
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    })
};

mainRouter.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../frontend/Views/main.html'));
});

mainRouter.get(
    "/highScore/:user_id",
    handle_errors(async (req, res) => {
        let result = await getHighScore(req.params.user_id);

        if (result.includes("Invalid"))
            res.status(400).send("Invalid Query")
        else if (result.length == 0)
            res.status(404).send("Invalid user_id")
        else
            res.json(result);
    })
);

mainRouter.get(
    "/checkWord/:word",
    handle_errors(async (req, res) => {
        let wordsOfDay = await getWordsOfDay();

        wordsOfDay.forEach((item) => {
            if (item.word == req.params.word.toUpperCase()) {
                res.send("Correct Word");
                return "t";
            }
        });

        //Check with word api
        
        res.send("t")
    })
);

module.exports = mainRouter;