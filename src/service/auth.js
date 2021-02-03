"use strict"
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authService = require('./authService');
var mysql = require('mysql')

const userService = require('./authService');

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
var refreshTokens = [];

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

app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
});

app.post('/login', (req, res) => {
    let accessToken="", refreshToken="";

    // Read email and password from request body
    const { email, password } = req.body;

    // Filter user from the users array by email[] and password
    authService.loginUser(email,password, (err,table) => {

        if(table.length<1) {
            console.log("User account not found");
            return res.sendStatus(403);
        } else {
            let row = table[0];

            accessToken = jwt.sign({ email: row.email, role: row.role}, accessTokenSecret, {expiresIn: '2m'});
            refreshToken = jwt.sign({ email: row.email, role: row.role }, refreshTokenSecret);
            refreshTokens.push(refreshToken);
            
            console.log(refreshTokens);
            res.send({accessToken, refreshToken});
        }
    });
});

app.post('/logout', (req, res) => {

    const { refreshToken } = req.body;
    if (undefined === refreshToken) {
        return res.sendStatus(401);
    }
    console.log(refreshToken, refreshTokens);
    console.log("before ", refreshTokens);
    refreshTokens = refreshTokens.filter(t => t !== refreshToken);
    console.log("after ", refreshTokens);
    res.send("Logout successful");
});

app.post('/register', (req, res) => {
    const {first_name,last_name,email,username,password,role} = req.body;
    console.log("first_name ", first_name);
    console.log("last_name ", last_name);
    console.log('email', email);
    console.log("username", username);
    console.log("password", password);
    console.log("role", role);
    res.send("Welcome ");
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


app.get('/users', authenticateJWT, (req,res) => {
    const { role } = req.user;
    console.log("role ", req.user);
    if (role !== 'admin') {
        return res.sendStatus(403);
    }
    authService.getUsers(userList => {
        res.send(JSON.stringify(userList));  
    })
});
