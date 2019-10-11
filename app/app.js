const express = require('express')
const http = require('http')
const cors = require('cors')

const registerRouter = require('./routes/registerRouter.js')

const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000

app.use(cors({origin: 'https://hermes-chat-ui.herokuapp.com'}))
app.use(registerRouter)

server.listen(port, () => {
    console.log('Server is up on port', port)
})