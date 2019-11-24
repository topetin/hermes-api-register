const db = require('../repository/mysql/channelQueries')
const responseHandler = require('../utils/ResponseHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const channelController = {}

channelController.createChannel = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const type = req.body.type
    const title = req.body.title
    const members = req.body.members

    if (!type || !title || !members) return responseHandler.missingRequiredParameters(res)

    let membersToAdd = []
    
    db.createChannel(authId, type, title)
    .then((result) => {
        members.map(id => membersToAdd.push([id, result.insertId]))
        db.addUserToChannel(membersToAdd)
            .then((result2) => {
                responseHandler.send200(res, {id: result.insertId, owner_id: authId, type: type, title: title})
            })
            .catch((error => responseHandler.serverError(res, error)));

    })
    .catch((error => responseHandler.serverError(res, error)));
}

channelController.getChannels = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    db.listChannels(authId)
        .then((result) => responseHandler.send200(res, result.length === 0 ? [] : result))
        .catch((error => responseHandler.serverError(res, error)));
}

const verifyToken = async (token) => {
    token = token.replace('Bearer ', '')
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'Secret Password', (err, user) => {
            if (err) return reject(err);
            return resolve(user);
        })
    })
}

module.exports = channelController;