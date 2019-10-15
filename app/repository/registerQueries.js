const db = require('./dbConnection')
const registerQueries = {}

registerQueries.getCountByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM company WHERE username = ?', [username], (error, result, fields) => {
            if (error) reject('Error fetching username ' + error.code)
            if (result) resolve(result)
        })
    })
}

registerQueries.createSubscription = (company, username, invoice) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO company SET ?', {name: company, username: username})
        .then((result) => {
            return db.query('INSERT INTO subscription SET ?', {company_id: result.insertId, invoice_num: invoice})
            .then(() => { return resolve(true) })
        })
        .catch((error) => { return reject('Error inserting in Database ' + error.code) })
    })
}

module.exports = registerQueries