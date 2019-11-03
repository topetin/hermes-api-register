const db = require('./mysqlConnection')

const backOfficeQueries = {}

backOfficeQueries.getSubscription = (companyId) => {
    return db.query(`SELECT * FROM subscription WHERE company_id = ?`, [companyId]);
}

backOfficeQueries.listUsers = (companyId) => {
    return db.query(`SELECT * FROM user WHERE company_id = ? and company_id <> id`, [companyId]);
}

module.exports = backOfficeQueries