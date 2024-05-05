var express = require("express")
const path = require("path");
const { join } = require("path");
const mainRouter = express.Router();
const {getUsers} = require('../database.queries');

const handle_errors = (fn) => (req, res, next) => {  
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    })
};

mainRouter.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../frontend/Views/main.html'));
});

mainRouter.get(
    "/users",
    handle_errors(async (req, res) => {
        let result = await getUsers();
        res.json(result);
    })
);

module.exports = mainRouter;