var express = require("express")
const path = require("path");
const { join } = require("path");
const { verifyToken, getEmailFromToken, verifyGoogleToken } = require("./Utility/auth");
const mainRouter = express.Router();
const {getHighScore, 
       getWordsOfTheDay,
       getRemainingUserScores,
       checkIfUserIDExists,
       checkIfWordIDExists,
       checkIfUserExistsAndAdd,
       addScore} = require('../database.queries');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
       
const jwtSecret = crypto.randomBytes(32).toString('hex');

const handle_errors = (fn) => (req, res, next) => {  
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    })
};

mainRouter.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/Views/main.html'));
});

mainRouter.get("/game", function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/Views/game.html'));
});

mainRouter.get(
    "/highScore/:user_id", verifyGoogleToken,
    handle_errors(async (req, res) => {
        let email = req.email;
        let result = await getHighScore(email); //req.params.user_id
        
        if (result.includes("Invalid"))
            res.status(400).send("Invalid Query")
        else if (result.length == 0)
            res.status(404).send("Invalid user_id")
        else
            res.json(result);
    })
);

mainRouter.get(
    "/getWordsOfTheDay", verifyGoogleToken,
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
    "/postScore", verifyGoogleToken,
    handle_errors(async (req, res) => {
        let email = req.email;
        const data = req.body;
        console.log('New Score:', data)

        let user_id = email; //req.headers.authorization
        let word_id = data.word_id;
        let guesses_taken = data.guesses_taken;

        console.log(word_id);
        console.log(guesses_taken);
        console.log(user_id);

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

mainRouter.get('/generateJWTToken', async(req, res) => {
    console.log("WE HIT HERE");
    const accessToken = req.headers.authorization.split(' ')[1]; 
    console.log("access token is " + accessToken);
    let email; 
  
    await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken)
            .then(response => response.json())
            .then(async data => {
                email = await data.email;
                
                console.log('Email:', email);
            })
            .catch(error => {
                console.error('Error:', error);
    });

  
    checkIfUserExistsAndAdd(email);       
    
    console.log(email);
    res.json({ email });
});

module.exports = mainRouter;