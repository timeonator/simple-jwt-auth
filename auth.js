const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
var refreshTokens = [];

app.use(bodyParser.json());


app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
});
app.post('/login', (req, res) => {
    const users = [
        {
            username: 'john',
            password: 'password123admin',
            role: 'admin'
        }, {
            username: 'anna',
            password: 'password123member',
            role: 'member'
        }
    ];
    // Read username and password from request body
    const { username, password } = req.body;
    console.log(username,password);
 
    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret, {expiresIn: '12ms'});
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshToken);
        res.json({
            accessToken, refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.post('/logout', (req, res) => {
    const { refeshToken } = req.body;
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

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});