const db = require('./mysqlConnection')

const backOfficeQueries = {}

backOfficeQueries.getSubscription = (companyId) => {
    return db.query(`SELECT * FROM subscription WHERE company_id = ?`, [companyId]);
}

module.exports = backOfficeQueries