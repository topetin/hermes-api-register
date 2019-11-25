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

channelQueries.getChannelMemebersInfo = (channelID) => {
    return db.query(`SELECT u.id, u.company_id, u.role_id, u.profile_img, u.username, u.name, u.active, u.email,
    c.id channel_id, c.owner_id channel_owner_id, c.type channel_type, c.title channel_title 
    FROM hermesdb.user u 
    INNER JOIN hermesdb.user_channel uc ON u.id = uc.user_id 
    INNER JOIN channel c on uc.channel_id= c.id WHERE c.id = ${channelID} `);
}

channelQueries.getChannelOwnerInfo = (channelID) => {
    return db.query(`SELECT u.id, u.company_id, u.role_id, u.profile_img, u.username, u.name, u.active, u.email,
    c.id channel_id, c.owner_id channel_owner_id, c.type channel_type, c.title channel_title 
    FROM hermesdb.user u 
    INNER JOIN hermesdb.channel c ON u.id = c.owner_id WHERE c.id = ${channelID} `);
}

channelQueries.removeUserFromChannel = (memberId, channelId) => {
    return db.query(`DELETE FROM user_channel WHERE user_id = ? AND channel_id = ?`, [memberId, channelId]);
}

channelQueries.removeChannelById = (channelId) => {
    console.log(`DELETE FROM user_channel WHERE channel_id = ${channelId}`)
    return db.query(`DELETE FROM user_channel WHERE channel_id = ${channelId}`);
}

channelQueries.removeChannelById2 = (channelId) => {
    console.log(`DELETE FROM channel WHERE id = ${channelId}`)
    return db.query(`DELETE FROM channel WHERE id = ${channelId}`);
}

channelQueries.updateChannelOwner = (channelId, userId) => {
    return db.query(`UPDATE channel SET owner_id = ? WHERE id = ?`, [channelId, userId]);
}

module.exports = channelQueries