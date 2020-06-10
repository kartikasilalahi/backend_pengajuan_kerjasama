const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysqlrootpasswordhere",
    database: 'app_kerjasama',
    port: "3306"
});

module.exports = db