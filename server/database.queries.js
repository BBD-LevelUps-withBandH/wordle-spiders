const { get } = require("http");
const path = require("path");
const {Client} = require('pg');

require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'db.env')
});
  
const client = new Client({
    user: "dbadmin",
    host: process.env.HOST,
    database: "wordle",
    password: process.env.PASSWORD,
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const queryWrapper = async(query) => {
    try {
        const result = await client.query(query);
        console.log('Query result:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err);
        return "Invalid"
    }
};

const getHighScore = async(user_id) => {
    let query =`SELECT * FROM see_high_scores 
                WHERE user_id = ${user_id}`;
    return await queryWrapper(query);
};

const getWordsOfTheDay = async() => {
    let query =`SELECT * FROM words
                WHERE played_date = CURRENT_DATE`;
    return await queryWrapper(query);
};

const getRemainingUserScores = async(user_id) => {
    let query =`SELECT * FROM calc_max_remaining_scores(${user_id})`;
    return await queryWrapper(query);
};

const checkIfUserIDExists = async(user_id) => {
    let query =`SELECT COUNT(*)
                FROM users
                WHERE user_id = ${user_id}`;
    return await queryWrapper(query);
};

const checkIfWordIDExists = async(word_id) => {
    let query =`SELECT COUNT(*)
                FROM words
                WHERE word_id = ${word_id}`;
    return await queryWrapper(query);
};

const addScore = async(word_id, user_id, guesses_taken) => {
    let query =`INSERT INTO scores (guesses_taken, word_id, user_id) VALUES
                (${guesses_taken}, ${word_id}, ${user_id});`;
    return await queryWrapper(query);
};

module.exports = {
    getHighScore,
    getWordsOfTheDay,
    getRemainingUserScores,
    checkIfUserIDExists,
    checkIfWordIDExists,
    addScore
}