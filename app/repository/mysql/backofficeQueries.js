const db = require('./mysqlConnection')

const backOfficeQueries = {}

backOfficeQueries.getSubscription = (companyId) => {
    return db.query(`SELECT * FROM subscription WHERE company_id = ?`, [companyId]);
}

backOfficeQueries.listUsers = (companyId) => {
    return db.query(`SELECT * FROM user WHERE company_id = ? and company_id <> id`, [companyId]);
}

backOfficeQueries.isAvailableEmail = (emails) => {
    return db.query(`SELECT * FROM user WHERE email IN(?)`, [emails]);
}

backOfficeQueries.addUsers = (values) => {
    return db.query(`INSERT INTO user (name, email, role_id, username, company_id ) VALUES ?`, [values])
}

module.exports = backOfficeQueries