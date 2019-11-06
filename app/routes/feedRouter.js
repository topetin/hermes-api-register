const express = require('express')
const bodyParser = require('body-parser')
const feed = require('../controllers/feedController')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.get('/get-feed', feed.getFeed)
router.post('/post-feed', feed.postFeed)

module.exports = router