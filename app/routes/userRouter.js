const express = require('express')
const bodyParser = require('body-parser')
const user = require('../controllers/userController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/change-profile-picture', user.changeProfilePicture)
router.post('/change-password', user.changePassword)
router.post('/change-name', user.changeName)

module.exports = router