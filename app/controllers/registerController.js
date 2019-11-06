const db = require('../repository/mysql/registerQueries')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responseHandler = require('../utils/ResponseHandler')

const registerController = {}

registerController.status = (req, res) => {
    responseHandler.send200(res, 'Register service is up')
}

registerController.isAvailableUser = (req, res) => {
    const email = req.query.email

    if (!email) return responseHandler.missingRequiredParameters(res);
    
    db.getUserCountByEmail(email)
    .then((result) => {
        if (result[0].count === 0) {
            responseHandler.send200(res, 'User is available.')
        } else {
            responseHandler.send400(res, 'User already registered.')
        }
    })
    .catch((error) => responseHandler.serverError(res, error))
}

registerController.subscribe = (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const invoice = req.body.invoice

    if (!name || !email || !invoice) return responseHandler.missingRequiredParameters(res);

    db.getUserCountByEmail(email)
    .then((result) => {
        if (result[0].count === 0) {
            const username = generateUsername(email)
            db.createSubscription(name, username, email, invoice)
            .then((result) => {
                const rows = JSON.parse(JSON.stringify(result[0]));
                emailService.sendEmail('subscription', rows[0].email, rows[0].user_role_id)
                responseHandler.send200(res, email)
            })
            .catch((error) => responseHandler.serverError(res, error))
        } else {
            responseHandler.send400(res, 'Username is taken.')
        }
    })
    .catch((error) => responseHandler.serverError(res, error))
}

registerController.activateAccount = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) return responseHandler.missingRequiredParameters(res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    db.isNewUser(email)
    .then((result) => {
        if (result.length === 0) return responseHandler.send404(res, 'User not found')
        if (result[0].password === null) {
            db.activateUser(result[0].id, hashedPassword)
            .then((result) => {
                if (result.affectedRows === 0) return responseHandler.send403(res, false)
                return responseHandler.send200(res, true)
            })
            .catch((error) => responseHandler.serverError(res, error))
        } else {
            responseHandler.send403(res, 'Account is already active')
        }
    })
    .catch((error) =>  responseHandler.serverError(res, error))
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

module.exports = registerController;