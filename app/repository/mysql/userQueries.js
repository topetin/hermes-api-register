const db = require('./mysqlConnection')

const userQueries = {}

userQueries.changeProfileImg = (id, profile_img) => {
    return db.query(`UPDATE user SET profile_img = ? WHERE id = ?`, [profile_img, id]);
}

userQueries.getUser = (id) => {
    return db.query(`SELECT * from user WHERE id = ?`, [id]);
}

userQueries.getPassword = (id) => {
    return db.query(`SELECT password from user WHERE id = ?`, [id]);
}

userQueries.updatePassword = (id, newPass) => {
    return db.query(`UPDATE user SET password = ? WHERE id = ?`, [newPass, id]);
}

module.exports = userQueries