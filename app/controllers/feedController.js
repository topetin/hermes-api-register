const Feed = require('../repository/mongo/feedModel')
const responseHandler = require('../utils/ResponseHandler')
const moment = require('moment')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoDb = require('../repository/mongo/feedQueries')

const feedController = {}

feedController.getFeed = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

        try {
            const feeds = await Feed.find({company_id: authId})
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            responseHandler.send200(res, feeds)
        }
        catch(e) {
            responseHandler.serverError(res, e)
        }
}

feedController.postFeed = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const message = req.body.message

    try {
        const feed = new Feed({
            company_id: authId,
            message: message,
            at: moment().format()
        })
    
        await feed.save()
        responseHandler.send200(res, feed)
    }
    catch(e) {
        responseHandler.serverError(res, e)
    }
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

module.exports = feedController;