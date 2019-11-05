const db = require('./mysqlConnection')

const backOfficeQueries = {}

backOfficeQueries.getSubscription = (companyId) => {
    return db.query(`SELECT * FROM subscription WHERE company_id = ?`, [companyId]);
}

backOfficeQueries.listUsers = (companyId) => {
    return db.query(`SELECT * FROM user WHERE company_id = ? and company_id <> id ORDER BY created_at desc`, [companyId]);
}

backOfficeQueries.isAvailableEmail = (emails) => {
    return db.query(`SELECT * FROM user WHERE email IN(?)`, [emails]);
}

backOfficeQueries.addUsers = (values) => {
    return db.query(`INSERT INTO user (name, email, role_id, username, company_id ) VALUES ?`, [values])
}

backOfficeQueries.deleteUsers = (emails, authId) => {
    return db.query(`DELETE FROM user WHERE email IN(?) AND company_id = ?`, [emails, authId]);
}

backOfficeQueries.modifyRole = (emails, role, authId) => {
    return db.query(`UPDATE user SET role_id = ? WHERE email IN(?) AND company_id = ?`, [role, emails, authId]);
}

module.exports = backOfficeQueries