const moment = require('moment')
const db = require('../repository/registerQueries')
const registerController = {}

registerController.status = (req, res) => {
    res.status(200).json({date: moment().format(), code: 200, message: 'Register service is up'})
}

registerController.isAvailableUsername = (req, res) => {
    const username = req.query.username

    db.getCountByUsername(username).then((result) => {
        if (result[0].count === 0) {
            res.status(200).json({date: moment().format(), code: 200, message: 'Username is available.'})
        } else {
            res.status(400).json({date: moment().format(), code: 400, message: 'Username is taken.'})
        }
    }).catch((error) => {
        res.status(400).json({date: moment().format(), code: 400, message: error})
    })
}

registerController.subscribe = (req, res) => {
    const company = req.body.company
    const username = req.body.username
    const invoice = req.body.invoice

    db.getCountByUsername(username).then((result) => {
        if (result[0].count === 0) {
            db.createSubscription(company, username, invoice)
            .then(() => {
                res.status(200).json({date: moment().format(), code: 200, message: 'Subscription successfuly created.'})
            })
            .catch((error) => {
                res.status(400).json({date: moment().format(), code: 400, message: error})
            })
        } else {
            res.status(400).json({date: moment().format(), code: 400, message: 'Username is taken.'})
        }
    }).catch((error) => {
        res.status(400).json({date: moment().format(), code: 400, message: error})
    })
}

registerController.addUser = (req, res) => {}

registerController.activateAccount = (req, res) => {}

module.exports = registerController;