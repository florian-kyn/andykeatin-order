//Database.js//
const mysql = require("mysql2");

class Database {
    constructor(token, time=null) {
        this.dbUsername = token.database.username;
        this.dbDatabase = token.database.database;
        this.dbPassword = token.database.password;
        this.dbHost = token.database.host;
        this.dbPort = token.database.port;
        this.time = time;
    }
    connection() {
        return mysql.createConnection({
            user: this.dbUsername,
            database: this.dbDatabase,
            password: this.dbPassword,
            host: this.dbHost,
            /*port: this.dbPort*/
        });
    }
    checkConnectionState() {
        this.connection().query(`CREATE TABLE IF NOT EXISTS test (test VARCHAR(30))`, (err) => {
            if(err) {
                console.log(`[${this.time(Date.now())}] The connection between the client & the Database has failed.`);
            } else {
                console.log(`[${this.time(Date.now())}] The connection between the client & the Database has been established.`);
            }
        });
    }
}

module.exports = {
    Database
}
