const express = require('express')
const bodyParser = require('body-parser')
const login = require('../controllers/loginController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/login', login.login)
router.get('/secure', login.secure)

module.exports = router