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
    let query =`SELECT * FROM seehighscores 
                WHERE user_id = ${user_id}`;
    return await queryWrapper(query);
};

const getWordsOfDay = async() => {
    let query =`SELECT * FROM words
                WHERE played_date = CURRENT_DATE`;
    return await queryWrapper(query);
};

module.exports = {
    getHighScore,
    getWordsOfDay
}