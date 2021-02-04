require('dotenv').config();
var mysql = require('mysql');
const bcrypt = require('bcrypt');
var mysql = require('mysql');

var sql = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DB
});
//
// get the user by unique email address
//
function loginUser(email, password, callback) {
    let query=`SELECT * FROM users WHERE email=\'${email}\';`;
  //    console.log(query);
    sql.query(query, function (err, result, fields) {
        if (err) {
            console.log(err.code)
        }
        callback(err,result);            
    });
};

function getUsers(callback) {
    const query = "SELECT * FROM users";
    sql.query(query, function (err, result, fields) {
        if (err) throw err
        console.log("Query Result: ", JSON.stringify(result));
        callback(result);
    });
}

function registerUser(user, callback) {
    console.log("Service : ", user);
    let query=`insert into users set first_name=?,
        last_name=?,
        email=?, 
        username=?, 
        password=?, 
        role=?`;
        sql.query(query,
            [
                user.first_name,
                user.last_name,
                user.email,
                user.username,
                user.password,
                user.role
            ], function(err, result, fields) {
                  if (err) throw err;
        callback();
    });

}

module.exports = {loginUser, getUsers, registerUser};

