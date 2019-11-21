const db = require('./mysqlConnection')

const userQueries = {}

userQueries.changeProfileImg = (id, profile_img) => {
    return db.query(`UPDATE user SET profile_img = ? WHERE id = ?`, [profile_img, id]);
}

userQueries.getUser = (id) => {
    return db.query(`SELECT * from user WHERE id = ?`, [id]);
}

userQueries.getCompanyByUser = (id) => {
    return db.query(`SELECT u2.* from user u join user u2 on u.company_id = u2.id WHERE u.id = ?`, [id]);
}

userQueries.getPassword = (id) => {
    return db.query(`SELECT password from user WHERE id = ?`, [id]);
}

userQueries.updatePassword = (id, newPass) => {
    return db.query(`UPDATE user SET password = ? WHERE id = ?`, [newPass, id]);
}

userQueries.changeName = (id, newName) => {
    return db.query(`UPDATE user SET name = ? WHERE id = ?`, [newName, id]);
}

userQueries.listUsers = (companyId, userId) => {
    return db.query(`SELECT * FROM user WHERE company_id = ? and company_id <> id and id <> ? and active = 1 ORDER BY name desc`, [companyId, userId]);
}

module.exports = userQueries