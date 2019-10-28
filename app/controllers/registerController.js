const moment = require('moment')
const db = require('../repository/mysql/registerQueries')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoDb = require('../repository/mongo/mongoQueries')

const registerController = {}

registerController.status = (req, res) => {
    res.status(200).json({date: moment().format(), code: 200, message: 'Register service is up'})
}

registerController.isAvailableUsername = (req, res) => {
    const username = req.query.username

    if (!username) return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})
    
    db.getUserCountByUsername(username).then((result) => {
        if (result[0].count === 0) {
            res.status(200).json({date: moment().format(), code: 200, message: 'Username is available.'})
        } else {
            res.status(400).json({date: moment().format(), code: 400, message: 'Username is taken.'})
        }
    }).catch((error) => {
        res.status(500).json({date: moment().format(), code: 500, message: error.message})
    })
}

registerController.subscribe = (req, res) => {
    const name = req.body.name
    const username = req.body.username
    const invoice = req.body.invoice

    if (!name || !username || !invoice) return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})

    db.getUserCountByUsername(username)
    .then((result) => {
        if (result[0].count === 0) {
            db.createSubscription(name, username, invoice)
            .then((result) => {
                const rows = JSON.parse(JSON.stringify(result[0]));
                emailService.sendEmail('subscription', rows[0].username, rows[0].user_role_id)
                res.status(200).json({date: moment().format(), code: 200, message: username})
            })
            .catch((error) => {
                res.status(400).json({date: moment().format(), code: 400, message: error.message})
            })
        } else {
            res.status(400).json({date: moment().format(), code: 400, message: 'Username is taken.'})
        }
    }).catch((error) => {
        res.status(500).json({date: moment().format(), code: 500, message: error.message})
    })
}

registerController.activateAccount = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    db.isNewUser(username)
    .then((result) => {
        if (result.length === 0) return res.status(404).json({date: moment().format(), code: 404, message: 'User not found'}) 
        if (result[0].password === null) {
            db.activateUser(result[0].id, hashedPassword)
            .then((result) => {
                if (result.affectedRows === 0) return res.status(404).json({date: moment().format(), code: 403, message: false})
                return res.status(200).json({date: moment().format(), code: 200, message: true})
            })
            .catch((error) => {
                res.status(500).json({date: moment().format(), code: 500, message: error.message})
            })
        } else {
            res.status(403).json({date: moment().format(), code: 403, message: 'Account is already active'})
        }
    })
    .catch((error) => {
        res.status(500).json({date: moment().format(), code: 500, message: error.message})
    })
}

registerController.addUser = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({date: moment().format(), code: 400, message: 'Missing token'})

    const auth = await verifyToken(token)
    .then((auth) => {
        return auth.username
    })
    .catch((error) => {
        res.status(401).json({date: moment().format(), code: 400, message: error.message});
    })

    let added = [];
    let notAdded = [];

    req.body.forEach(element => {
        if (!element.name || !element.username || !element.role) 
            return notAdded.push({ element: element, cause: 'Missing required parameters' })
        db.getUserCountByUsername(element.username)
        .then((result) => {
            if (result[0].count !== 0) 
                return notAdded.push({ element: element, cause: 'Username taken' })
            db.addUser
        })
    });
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

registerController.changeRole = (req, res) => {

}

module.exports = registerController;