const db = require('./mysqlConnection')
const registerQueries = {}

const COMPANY_ROLE = { id: 1, description: 'OWNER'}

registerQueries.getUserCountByEmail = (email) => {
    return db.query(`SELECT COUNT(*) as count FROM user WHERE email = ?`, [email]);
}

registerQueries.createSubscription = (name, username, email, invoice) => {
    return db.query(`CALL createSubscription('${name}', '${email}', '${username}', '${invoice}', ${COMPANY_ROLE.id})`);
}

registerQueries.isNewUser = (email) => {
    return db.query(`SELECT id, password FROM user WHERE email = ?`, [email]);
}

registerQueries.activateUser = (id, password) => {
    return db.query(`UPDATE user SET password = ? WHERE id = ?`, [password, id]);
}

// registerQueries.addUser({})

module.exports = registerQueries