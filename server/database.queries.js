const { get } = require("http");
const path = require("path");
const {Client} = require('pg');

require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'db.env')
});
  
const client = new Client({
    user: "dbadmin",
    host: process.env.DB_URL,
    database: "wordle",
    password: process.env.DB_PASSWORD,
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
        console.log(query);
        const result = await client.query(query);
        console.log('Query result:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err);
        return "Invalid"
    }
};

const getHighScore = async(user_email) => {
    let query =`SELECT * FROM see_high_scores 
                WHERE user_email = '${user_email}'`;
    return await queryWrapper(query);
};

const getWordsOfTheDay = async() => {
    let query =`SELECT * FROM words
                WHERE played_date = CURRENT_DATE`;
    return await queryWrapper(query);
};

const getRemainingUserScores = async(user_email) => {
    let query =`SELECT * FROM calc_max_remaining_scores('${user_email}')`;
    console.log(query, 'Remaining user scores');
    return await queryWrapper(query);
};

const checkIfUserExists = async(user_email) => {
    let query =`SELECT COUNT(*)
                FROM users
                WHERE user_email = '${user_email}'`;
    return await queryWrapper(query);
};

const checkIfUserExistsAndAdd = async (user_email) => {
    let query = `insert into users(user_email)
    select '${user_email}' where not exists 
    (select user_email from users u where u.user_email = '${user_email}')`

    let result = await queryWrapper(query);
    console.log(result); 
};

const checkIfWordExists = async(word) => {
    let query =`SELECT COUNT(*)
                FROM words
                WHERE word = '${word}'`;
    return await queryWrapper(query);
};

const addScore = async(user_email, word, guesses_taken) => {
    let query = `CALL add_score('${user_email}', '${word}', ${guesses_taken});`;
    return await queryWrapper(query);
};

const getAverageScore = async(word) =>{
    const wordOfTheDay = word;
    const query = `SELECT public.get_average_score_for_word('${wordOfTheDay}') AS avg_score`;
    return await queryWrapper(query);

}

module.exports = {
    getHighScore,
    getWordsOfTheDay,
    getRemainingUserScores,
    checkIfUserExists,
    checkIfWordExists,
    addScore,
    checkIfUserExistsAndAdd,
    getAverageScore
}