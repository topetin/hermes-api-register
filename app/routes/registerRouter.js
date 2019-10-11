const express = require('express')
const register = require('../controllers/registerController')

const router = new express.Router()

router.get('', register.getHelloWorld)

module.exports = router