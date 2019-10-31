const db = require('./mysqlConnection')
const loginQueries = {}

loginQueries.getCredentials = (email) => {
    return db.query('SELECT * FROM user WHERE email = ?', [email])
}

module.exports = loginQueries