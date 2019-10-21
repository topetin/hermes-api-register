const db = require('./mysqlConnection')
const loginQueries = {}

loginQueries.getCredentials = (username) => {
    return db.query('SELECT id, password FROM user WHERE username = ?', [username])
}

module.exports = loginQueries