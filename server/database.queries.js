const { get } = require("http");
const path = require("path");
const {Client} = require('pg');

require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'db.env')
});
  
const client = new Client({
user: process.env.USER,
host: process.env.HOST,
database: process.env.DATABASE,
password: process.env.PASSWORD,
port: process.env.PORT,
ssl: {
    require: true,
    rejectUnauthorized: false
}
});

client.connect(function(err) {
if (err) throw err;
console.log("Connected!");
});

const getUsers = async (tx) => {
    let q = `
    SELECT * FROM users
    `;

    try {
        const result = await client.query(q);
        console.log('Query result:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err);
        throw err;
    }
};


module.exports = {
    getUsers
}