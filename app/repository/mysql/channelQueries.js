const db = require('./mysqlConnection')
const channelQueries = {}

channelQueries.createChannel = (ownerId, type, title) => {
    return db.query(`INSERT INTO channel (owner_id, type, title) VALUES (${ownerId}, '${type}', '${title}')`)
}

channelQueries.addUserToChannel = (userId, channelId) => {
    return db.query(`INSERT INTO user_channel (user_id, channel_id) VALUES (${userId}, ${channelId})`)
}

module.exports = channelQueries