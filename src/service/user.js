const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'youraccesstokensecret';
const app = express();

app.use(bodyParser.json());
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
app.get('/users', (req, res) => {
    const query = "SELECT * FROM users";
    connection.query(query, function (err, result, fields) {
        if (err) throw err
        res.send(JSON.stringify(result));
    });