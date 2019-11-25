const express = require('express')
const bodyParser = require('body-parser')
const channel = require('../controllers/channelController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/create-channel', channel.createChannel)
router.get('/get-channels', channel.getChannels)
router.get('/get-channel-info', channel.getChannelInfo)
router.post('/remove-member', channel.removeMember)
router.post('/remove-channel', channel.removeChannel)
router.post('/add-member', channel.addMember)
router.post('/remove-single-channel', channel.removeSingleChannel)

module.exports = router