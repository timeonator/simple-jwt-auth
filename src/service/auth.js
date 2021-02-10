"use strict"
const cors = require('cors');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authService = require('./authService');
var mysql = require('mysql')
const userService = require('./authService');

var corsOptions = {
    Origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

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
            // console.log(user);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

function encrypt(pw) {
    const saltRounds = 10;
    let result = bcrypt.hashSync(pw, saltRounds);
    return (result);
}

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(3001, () => {
    console.log('Authentication service started on port 3001');
});

app.post('/login', (req, res) => {
    let accessToken="", refreshToken="";
    // console.log(req.body);
    // Read email and password from request body
    const { email, password } = req.body;
 
    // Filter user from the users array by email[] and password
    authService.loginUser(email, password , (err,table) => {

        if(table.length<1) {
            console.log("User account not found");
            return res.sendStatus(403);
        } else {
            let row = table[0];
            if (bcrypt.compareSync(password, row.password)){
                accessToken = jwt.sign({ email: row.email, role: row.role}, accessTokenSecret, {expiresIn: '20m'});
                refreshToken = jwt.sign({ email: row.email, role: row.role }, refreshTokenSecret);
                refreshTokens.push(refreshToken);                
                console.log(refreshTokens);
                res.send(JSON.stringify({token:accessToken}));
            } else {
                res.sendStatus(401);
            }


        }
    });
});

app.post('/logout', (req, res) => {

    const { refreshToken } = req.body;
    if (undefined === refreshToken) {
        return res.sendStatus(401);
    }
    refreshTokens = refreshTokens.filter(t => t !== refreshToken);
    console.log(refreshToken, refreshTokens);
    res.send("Logout successful");
});

app.post('/register', cors({Origin: 'http://localhost:3000'}), (req, res) => {
    let user = req.body;
//    console.log(req.body);
    user.password = encrypt(user.password);
    authService.registerUser(user,(status)=>{
        res.send("Welcome");
    });

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
