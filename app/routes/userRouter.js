const express = require('express')
const bodyParser = require('body-parser')
const user = require('../controllers/userController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.get('/get-user', user.getUser)
router.get('/get-company-feed', user.getCompanyFeed)
router.get('/get-company-users', user.getCompanyUsers)
router.get('/search', user.search)
router.post('/change-profile-picture', user.changeProfilePicture)
router.post('/change-password', user.changePassword)
router.post('/change-name', user.changeName)

module.exports = router