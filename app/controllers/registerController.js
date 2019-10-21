const moment = require('moment')
const db = require('../repository/mysql/registerQueries')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
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
                res.status(200).json({date: moment().format(), code: 200, message: 'Subscription successfuly created.'})
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

registerController.addUser = (req, res) => {
    const authToken = req.body.authToken
    const companyId = req.body.company

    if (!authToken || !companyId) {
        res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})
    }

    //search in session service if company is logged in

    //si esta loggeado

    const username = req.body.username
    const name = req.body.name
    const role = req.body.role

    // if (!username || !name || ! role) {
    //     res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})
    // }

    // db.getCompanyCountByUsername(username).then((result) => {
    //     if (result[0].count === 0) {

    //     } else {
    //         res.status(400).json({date: moment().format(), code: 400, message: 'Username is taken.'})
    //     }
    // }).catch((error) => {
    //     res.status(400).json({date: moment().format(), code: 400, message: error})
    // })

}

registerController.changeRole = (req, res) => {

}

module.exports = registerController;