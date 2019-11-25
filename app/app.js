const express = require('express')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')
const mongoose = require('mongoose')

const State = require('./repository/mongo/AppStateModel')

const registerRouter = require('./routes/registerRouter.js')
const authRouter = require('./routes/authRouter.js')
const backofficeRouter = require('./routes/backofficeRouter.js')
const userRouter = require('./routes/userRouter.js')
const feedRouter = require('./routes/feedRouter.js')
const channelRouter = require('./routes/channelRouter.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const chattApp = io.of('/app');

chattApp.on('connection', (socket) => {

    socket.on('emit-online', async (data) => {
        socket.user = data.userId
        socket.company = data.companyId

        socket.join(data.companyId)

        findAndSaveState(data.companyId, data.userId, socket.id)
        .then((result) => io.of('/app').to(data.companyId).emit('on-online', {user: data.userId, socketId: socket.id}))
        .catch((error) => console.log(error))
    })

    console.log('a user connected');

    // socket.on('join', (joinData) => {
    //     socket.user = joinData.user
    //     socket.channel = joinData.channel
    //     socket.join(joinData.channel)
    //     io.of('/app').to(joinData.channel).emit('new-member', {channel: joinData.channel, user: joinData.user})
    // })

    // socket.on('new-message', (data) => {
    //     io.of('/quickRoom').to(data.room).emit('new-message', data.message)
    // })

    // socket.on('typing', (data) => {
    //     if (data.user === false) {
    //         socket.to(data.room).emit('typing', false)
    //     } else {
    //         socket.to(data.room).emit('typing', data.user)
    //     }
        
    // })

    socket.on('disconnect', function(){
        deleteState(socket.company, socket.user)
        .then((result) => io.of('/app').to(socket.room).emit('on-offline', {user: socket.user}))
        .catch((error) => console.log(error))
        console.log('user disconnected')
    })
  })

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
app.use(backofficeRouter)
app.use(userRouter)
app.use(feedRouter)
app.use(channelRouter)

server.listen(port, () => {
    console.log('Server is up on port', port)
})

const findAndSaveState = async (companyId, userId, socketId) => {
    const state = new State({ companyId: companyId, userId: userId, socketId: socketId })
    return new Promise((resolve, reject) => {
            State.findOne({companyId: companyId, userId: userId, socketId: socketId}, async function (err, user) {
                if (user) {
                    resolve(user)
                } else {
                    await state.save(function (error) {
                        if(error) reject(error)
                        resolve(true)
                    });
                }
                if (err) reject(error)
            })
    })
}

const deleteState = async (companyId, userId) => {
    return new Promise((resolve, reject) => {
        State.deleteMany({ companyId: companyId, userId: userId }, function (error, res) {
            if (error) {
                reject(error)
            } else {
                resolve(true)
            }
        });
    })
}
