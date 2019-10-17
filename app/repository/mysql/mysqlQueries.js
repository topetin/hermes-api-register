const db = require('./mysqlConnection')
const registerQueries = {}

registerQueries.getUserCountByUsername = (username, table) => {
    return db.query(`SELECT COUNT(*) as count FROM ${table} WHERE username = ?`, [username])
}

registerQueries.createSubscription = (company, username, invoice) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO company SET ?', {name: company, username: username})
        .then((result) => {
            let companyId = result.insertId;
            return db.query('INSERT INTO subscription SET ?', {company_id: companyId, invoice_num: invoice})
            .then(() => { return resolve(companyId) })
        })
        .catch((error) => { return reject('Error inserting in Database ' + error.code) })
    })
}

registerQueries.isNewUser = (userID, userType) => {
    let table = userType === 1 ? 'company' : 'user';
    return db.query(`SELECT password FROM ${table} WHERE id = ?`, [userID])
}



module.exports = registerQueries