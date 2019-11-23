const express = require('express')
const bodyParser = require('body-parser')
const channel = require('../controllers/channelController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/create-channel', channel.createChannel)
router.get('/get-channels', channel.getChannels)

module.exports = router