const responseHandler = require('../utils/ResponseHandler')
const Notification = require('../repository/mongo/NotificationModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const notificationController = {}

notificationController.postNotification = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const companyId = req.body.companyId;
    const channelId = req.body.channelId;
    const message = req.body.message;
    const userId = req.body.userId;

    try {
        const notification = new Notification({
            company_id: companyId,
            user_id: userId,
            channel_id: channelId,
            message: message,
            at: moment().format(),
            viewed: 0
        })
    
        await notification.save()
        responseHandler.send200(res, notification)
    }
    catch(e) {
        responseHandler.serverError(res, e)
    }
}

notificationController.getNotifications = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    try {
        const notifications = await Notification.find({user_id: authId}).sort({'_id': 1})
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        responseHandler.send200(res, notifications)
    }
    catch(e) {
            responseHandler.serverError(res, e)
    }
    
}

notificationController.updateNotifications = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    try {
        const notifications = await Notification.updateMany({"user_id": authId}, {"$set":{"viewed": 1}}, {"multi": true}, (err, writeResult) => {});
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        responseHandler.send200(res, notifications)
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

module.exports = notificationController;