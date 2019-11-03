const db = require('../repository/mysql/backofficeQueries')
const responseHandler = require('../utils/ResponseHandler')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoDb = require('../repository/mongo/mongoQueries')

const backofficeController = {}

backofficeController.getSubscription = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    db.getSubscription(authId)
    .then((result) => responseHandler.send200(res, result[0]))
    .catch((error) => responseHandler.serverError(res, error))
}

backofficeController.listUsers = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    db.listUsers(authId)
    .then((result) => responseHandler.send200(res, result.length === 0 ? [] : result[0]))
    .catch((error) => responseHandler.serverError(res, error))
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

module.exports = backofficeController;