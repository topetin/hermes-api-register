const express = require('express')
const bodyParser = require('body-parser')
const backoffice = require('../controllers/backOfficeController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.get('/subscription', backoffice.getSubscription)
router.get('/list-users', backoffice.listUsers)
router.post('/add-users', backoffice.addUsers)
router.post('/delete-users', backoffice.deleteUser)
router.post('/modify-role', backoffice.modifyRole)

// router.post('/resend-invitation', backoffice.resendInvitation)

module.exports = router