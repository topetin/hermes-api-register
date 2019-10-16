const moment = require('moment')
const mysqlDb = require('../repository/mysql/mysqlQueries')
const emailService = require('../services/emailService')
const mongoDb = require('../repository/mongo/mongoQueries')

const registerController = {}

registerController.status = (req, res) => {
    res.status(200).json({date: moment().format(), code: 200, message: 'Register service is up'})
}

registerController.isAvailableUsername = (req, res) => {
    const username = req.query.username

    if (!username) {
        res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})
    }
    
    mysqlDb.getCompanyCountByUsername(username).then((result) => {
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

    if (!company || !username || !invoice) {
        res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})
    }

    mysqlDb.getCompanyCountByUsername(username).then((result) => {
        if (result[0].count === 0) {
            mysqlDb.createSubscription(company, username, invoice)
            .then(() => {
                emailService.sendEmailSubscription(username)
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

registerController.activateAccount = (req, res) => {
    
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

    // mysqlDb.getCompanyCountByUsername(username).then((result) => {
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