const db = require('./mysqlConnection')
const channelQueries = {}

channelQueries.createChannel = (ownerId, type, title) => {
    return db.query(`INSERT INTO channel (owner_id, type, title) VALUES (${ownerId}, '${type}', '${title}')`)
}

channelQueries.addUserToChannel = (values) => {
    return db.query(`INSERT INTO user_channel (user_id, channel_id) VALUES ?`, [values])
}

channelQueries.listChannels = (userId) => {
    return db.query(`SELECT DISTINCT c.* FROM channel c INNER JOIN user_channel uc ON c.id = uc.channel_id WHERE (c.owner_id = ${userId} or uc.user_id = ${userId}) ORDER BY c.title`);
}

module.exports = channelQueries