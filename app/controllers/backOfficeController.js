const moment = require('moment')
const db = require('../repository/mysql/backofficeQueries')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoDb = require('../repository/mongo/mongoQueries')

const backofficeController = {}

backofficeController.getSubscription = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({date: moment().format(), code: 400, message: 'Missing token'})

    const authId = await verifyToken(token)
    .then((auth) => {
        return auth.id
    })
    .catch((error) => {
        res.status(401).json({date: moment().format(), code: 400, message: error.message});
    })

    db.getSubscription(authId)
    .then(
        (result) => res.status(200).json({date: moment().format(), code: 200, message: result[0]})
    )
    .catch(
        (error) => res.status(500).json({date: moment().format(), code: 500, message: error.message})
    )
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