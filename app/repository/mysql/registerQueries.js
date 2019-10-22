const db = require('./mysqlConnection')
const registerQueries = {}

const COMPANY_ROLE = { id: 1, description: 'OWNER'}

registerQueries.getUserCountByUsername = (username) => {
    return db.query(`SELECT COUNT(*) as count FROM user WHERE username = ?`, [username]);
}

registerQueries.createSubscription = (name, username, invoice) => {
    return db.query(`CALL createSubscription('${name}', '${username}', '${invoice}', ${COMPANY_ROLE.id})`);
}

registerQueries.isNewUser = (username) => {
    return db.query(`SELECT id, password FROM user WHERE username = ?`, [username]);
}

registerQueries.activateUser = (id, password) => {
    return db.query(`UPDATE user SET password = ? WHERE id = ?`, [password, id]);
}

// registerQueries.addUser({})

module.exports = registerQueries