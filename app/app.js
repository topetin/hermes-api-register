const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')

const registerRouter = require('./routes/registerRouter.js')
const loginRouter = require('./routes/loginRouter.js')

const app = express()
const server = http.createServer(app)

mongoose.connect('mongodb+srv://admin:Hermes2019@hermes-z3jam.mongodb.net/test?retryWrites=true&w=majority', {
    dbName: 'hermes', useNewUrlParser: true, useUnifiedTopology: true
}).then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => console.error(err));

const port = process.env.PORT || 3000

app.use(cors({origin: 'https://hermes-chat-ui.herokuapp.com'}))
app.use(registerRouter)
app.use(loginRouter)

server.listen(port, () => {
    console.log('Server is up on port', port)
})