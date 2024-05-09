var express = require("express")
const path = require("path");
const { join } = require("path");
const  verifyGoogleToken  = require("./Utility/auth.js");
const mainRouter = express.Router();
const {getHighScore, 
       getWordsOfTheDay,
       getRemainingUserScores,
       checkIfUserExists,
       checkIfWordExists,
       checkIfUserExistsAndAdd,
       getAverageScore,
       addScore} = require('../database.queries');

const handle_errors = (fn) => (req, res, next) => {  
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    })
};

mainRouter.get("/", function (req, res) {
    res.send("Health is good");
    // res.sendFile(path.join(__dirname, '../../frontend/Views/main.html'));
});

// mainRouter.get("/game", function (req, res){
//     res.sendFile(path.join(__dirname, '../../frontend/Views/game.html'));
// })

// mainRouter.get("/stats", function (req, res){
//     res.sendFile(path.join(__dirname, '../../frontend/Views/stats.html'));
// })

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

        let word = data.word;
        let guesses_taken = data.guesses_taken;

        console.log(email);
        console.log(guesses_taken);
        console.log(word);

        let userCount = await checkIfUserExists(email);
        let wordCount = await checkIfWordExists(word);

        if (userCount[0].count == 0)
            res.status(400).send("User Does Not Exist")
        else if (wordCount[0].count == 0)
            res.status(400).send("Word Does Not Exist")
        else {
            let remainingUserScores = await getRemainingUserScores(email);

            if (remainingUserScores[0].calc_max_remaining_scores <= 0)
                res.status(400).send("More Scores Added Than Words Of Day")
            else {
                let result = await addScore(email, word, guesses_taken)
                if (result.includes("ERROR"))
                    res.status(400).send("Invalid Query")
                else
                    res.send("Success")
            }
        }
    })
);

//rename this 
mainRouter.post('/addUser', async(req, res) => {
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

mainRouter.get('/getAverageScore', verifyGoogleToken, async (req, res) => {
    let word = req.query.word;
    console.log("word is: " + word);
    let result = await getAverageScore(word);

    if (result === "Invalid") {
        res.status(400).send("Invalid Query");
    } else if (result === 0) {
        res.status(404).send("No scores for word");
    } else {
        console.log(result[0].avg_score);
        res.json(result[0].avg_score);
    }
});

module.exports = mainRouter;