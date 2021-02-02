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

function loginUser(email, password, callback) {
    let query=`SELECT * FROM users WHERE email=\'${email}\' AND password=\'${password}\';`;
  //    console.log(query);
    sql.query(query, function (err, result, fields) {
        if (err) {
            console.log(err.code)
        }
        callback(err,result);            
    });
};

module.exports = loginUser;

// app.get('/password/:pw', cors(corsOptions), (req, res) => {
//     const saltRounds = 10;
//     const myPlaintextPassword = req.params.pw;
//     bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//         res.send(hash);
//     });
// });
// app.put('/password/:id/:pw', cors(corsOptions), (req,res)=>{
//     const saltRounds = 10;
//     const myPlaintextPassword = req.params.pw;
//     bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//         const query = `update users set users.password=? where users.id=?`;
//         console.log(query,[hash,req.params.id]);
//         connection.query(query, [hash, req.params.id], (error, results, fields) => {
//             if (error){
//                 res.end();
//                 return console.error(error.message);
//             }  
//             console.log('Updated ', results);
//             res.end();
//         });
//     });
// });


// app.get('/users',  (req, res) => {
//     const query = "SELECT * FROM users";
//     connection.query(query, function (err, result, fields) {
//         if (err) throw err
//         console.log("Query Result: ", JSON.stringify(result));
//         res.send(JSON.stringify(result));
//     });
// });

// app.get('/user/:email', cors(corsOptions), function (req, res, next) {
//     let query=`SELECT * FROM users where email=?`;

//     console.log("Query params: ", JSON.stringify(req.params));
//     connection.query(query, [req.params.email,req.params.password],  function (err, result, fields) {
//         if (err) throw err
//         console.log("Query Result: ", JSON.stringify(result));
//         res.send(JSON.stringify(result));
//     });
//   });

//   app.post('/user',  function(req, res) {
//       let query=`insert into users set users.email = ?, users.password=?`;
    
//       console.log("Request Body: ", req.body);
//       connection.query(query,[req.body.email,req.body.password], function(err, result, fields) {
//           if (err) throw err;
//           res.send(JSON.stringify(result));
//       });

//   });
  
// // app.get('/user/:id:email', (req, res, next) => {
// //     console.log(JSON.stringify(req.params));
// //     res.send(JSON.stringify(req.param));
// // });

// app.post('/user:index', (req, res) => {
//     console.log(`post to /user port ${PORT}`);
// });

// app.post('/users/:first_name/:last_name/:email/:username', (req, res) => {
//     let sql = `INSERT INTO users(first_name, last_name, email, username) VALUES( ?, ?, ?, ?)`;
//     let p = req.params;
//     // console.log(p);
//     let params = [req.params.first_name, p.last_name, p.email, p.username];
//     connection.query(sql, [p.first_name,p.last_name,p.email,p.username], (error, results, fields) => {
//       if (error){
//         return console.error(error.message);
//         res.end();
//       }  
//       console.log('Added Row(s) from Users:', results.affectedRows);
//       res.end();
//     });
// });

// app.delete('/user/:id', (req, res) => {
//     let sql = `DELETE FROM users WHERE users.id = ?`;
//     connection.query(sql, Number(req.params.id), (error, results, fields) => {
//       if (error)
//         return console.error(error.message);
        
//       console.log('Deleted Row(s) from Users:', results.affectedRows);
//       res.end();
//     });
// });
