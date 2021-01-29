var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lull5gogM#',
  database: 'pikto'
});
export default connection;