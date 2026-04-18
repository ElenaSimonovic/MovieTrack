const mysql = require('mysql');
const dbConfig = require('../dbConfig');

const dbConn = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

dbConn.connect(err => {
    if (err) throw err;
    console.log("DB spojena");
});

module.exports = dbConn;