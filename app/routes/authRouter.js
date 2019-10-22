const express = require('express')
const bodyParser = require('body-parser')
const auth = require('../controllers/authController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/login', auth.login)
router.get('/secure', auth.secure)

module.exports = router