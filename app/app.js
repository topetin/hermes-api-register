const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')

const registerRouter = require('./routes/registerRouter.js')
const authRouter = require('./routes/authRouter.js')

const app = express()
const server = http.createServer(app)

mongoose.connect('mongodb+srv://admin:Hermes2019@hermes-z3jam.mongodb.net/test?retryWrites=true&w=majority', {
    dbName: 'hermes', useNewUrlParser: true, useUnifiedTopology: true
}).then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => console.error(err));

const port = process.env.PORT || 3000

app.use(cors({origin: 'http://localhost:4200'}))
app.use(registerRouter)
app.use(authRouter)

server.listen(port, () => {
    console.log('Server is up on port', port)
})