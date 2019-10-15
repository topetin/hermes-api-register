const express = require('express')
const bodyParser = require('body-parser')
const register = require('../controllers/registerController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.get('', register.status)
router.get('/available-username', register.isAvailableUsername)
router.post('/subscribe', register.subscribe)
router.post('/add-user', register.addUser)
router.post('/activate-account', register.activateAccount)

module.exports = router