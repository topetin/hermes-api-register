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
    .then((result) => responseHandler.send200(res, result.length === 0 ? [] : result))
    .catch((error) => responseHandler.serverError(res, error))
}

backofficeController.addUsers = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const users = req.body.users;

    let emailList = [];
    for (let i = 0; i< users.length; i++) {
        let obj = Object.assign({}, users[i]);
        emailList.push(obj.email);
    }
    
    let values = []

    db.isAvailableEmail(emailList)
    .then((result) => {
        if (result.length > 0) {
            let existentEmails = []
            for (let i = 0; i< result.length; i++) {
                let obj = Object.assign({}, result[i]);
                existentEmails.push(obj.email);
            }
            return responseHandler.send403(res, existentEmails)
        }
        for (let i = 0; i < users.length; i++) {
            let obj = Object.assign({}, users[i]);
            let reg = []
            Object.keys(obj).forEach(item => {reg.push(obj[item])})
            reg.push(generateUsername(obj.email))
            reg.push(authId)
            values.push(reg)
        }
        db.addUsers(values)
        .then((result2) => {
            for (let i = 0; i < emailList.length; i++) {
                emailService.sendEmail('addedUser', emailList[i], 2)
            }
            responseHandler.send200(res, true)
        })
        .catch((error2) => responseHandler.serverError(res, error2))
    })
    .catch((error) => responseHandler.serverError(res, error))
}

backofficeController.deleteUser = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const users = req.body.users;

    let emailList = [];
    for (let i = 0; i< users.length; i++) {
        let obj = Object.assign({}, users[i]);
        emailList.push(obj.email);
    }

    db.deleteUsers(emailList, authId)
    .then((result) => responseHandler.send200(res, true))
    .catch((error) => responseHandler.serverError(res, error))
}


backofficeController.modifyRole = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const users = req.body.users;

    let emailList = [];
    for (let i = 0; i< users.length; i++) {
        let obj = Object.assign({}, users[i]);
        emailList.push(obj.email);
    }

    db.resendInvitations(emailList, role, authId)
    .then((result) => responseHandler.send200(res, true))
    .catch((error) => responseHandler.serverError(res, error))

}

backofficeController.resendInvitations = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const users = req.body.users;

    let emailList = [];
    for (let i = 0; i< users.length; i++) {
        let obj = Object.assign({}, users[i]);
        emailList.push(obj.email);
    }

    try {
        for (let i = 0; i < emailList.length; i++) {
            emailService.sendEmail('addedUser', emailList[i], 2)
        }
        responseHandler.send200(res, true)
    } catch (e) {
        responseHandler.serverError(res, error)
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

const generateUsername = (email) => {
    return email.split('@')[0];
}

module.exports = backofficeController;