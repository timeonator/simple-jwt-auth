"use strict"
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const getUser = require('./authService');
var mysql = require('mysql')

const userService = require('./authService');

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
var refreshTokens = [];

app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
});

app.post('/login', (req, res) => {
    let accessToken="", refreshToken="";

    // Read email and password from request body
    const { email, password } = req.body;

    // Filter user from the users array by email[] and password
    getUser(email,password, (err,table) => {

        if(err || table.length<1) {
            console.log("User account not found");
            res.send("{}");
        } else {
            let row = table[0];
            accessToken = jwt.sign({ email: row.email }, accessTokenSecret, {expiresIn: '12ms'});
            refreshToken = jwt.sign({ email: row.email }, refreshTokenSecret);
            refreshTokens.push(refreshToken);
            console.log(accessToken);
            res.send({accessToken});
        }
    });
});

app.post('/logout', (req, res) => {
    const { refeshToken } = req.body;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    console.log(refreshToken, refreshTokens);
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.send("Logout successful");
});

app.post('/token', (req, res) => {
    const { token } = req.body;
    console.log(token);

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ email: user.email, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});
