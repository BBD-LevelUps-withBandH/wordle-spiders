var express = require("express")
const path = require("path");
const { join } = require("path");
const mainRouter = express.Router();
const {getHighScore, 
       getWordsOfTheDay,
       getRemainingUserScores,
       checkIfUserIDExists,
       checkIfWordIDExists,
       addScore} = require('../database.queries');

const handle_errors = (fn) => (req, res, next) => {  
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    })
};

mainRouter.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/Views/game.html'));
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
    "/getWordsOfTheDay",
    handle_errors(async (req, res) => {
        console.log("WE ARE HERE!");
        let result = await getWordsOfTheDay();
        
        if (result.length == 0)
            res.status(404).send("No Words of the Day")
        else
            res.json(result);
    })
);

mainRouter.post(
    "/postScore",
    handle_errors(async (req, res) => {
        const data = req.body;
        console.log('New Score:', data)

        let user_id = data.user_id;
        let word_id = data.word_id;
        let guesses_taken = data.guesses_taken;

        let userIDCount = await checkIfUserIDExists(user_id);
        let wordIDCount = await checkIfWordIDExists(word_id);

        if (userIDCount[0].count == 0)
            res.status(400).send("User Does Not Exist")
        else if (wordIDCount[0].count == 0)
            res.status(400).send("Word Does Not Exist")
        else {
            let remainingUserScores = await getRemainingUserScores(user_id);

            if (remainingUserScores[0].calc_max_remaining_scores <= 0)
                res.status(400).send("More Scores Added Than Words Of Day")
            else {
                let result = await addScore(word_id, user_id, guesses_taken)
                if (result.includes("Invalid"))
                    res.status(400).send("Invalid Query")
                else
                    res.send("Success")
            }
        }
    })
);

module.exports = mainRouter;