const express = require('express')
const bodyParser = require('body-parser')
const notification = require('../controllers/notificationController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/post-notification', notification.postNotification)
router.get('/get-notifications', notification.getNotifications)
router.post('/update-notifications', notification.updateNotifications)


module.exports = router