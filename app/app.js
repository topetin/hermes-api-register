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
const notificationRouter = require('./routes/notificationRouter.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const chattApp = io.of('/app');

chattApp.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('emit-online', async (data) => {
        socket.user = data.userId
        const companyId = 'company' + data.companyId;
        socket.company = companyId
        socket.join(companyId)

        findAndSaveState(companyId, data.userId, socket.id)
        .then((result) => io.of('/app').to(companyId).emit('on-online', {userId: data.userId, socketId: socket.id}))
        .catch((error) => console.log(error))
    })

    socket.on('emit-join', (data) => {
        data.channels.map((channel) => {
            socket.join(channel)
            io.of('/app').to(channel).emit('on-join', {channel: channel, user: socket.user})
        })
    })

    socket.on('emit-message-from-new-channel', (data) => {
        io.of('/app').to(data.socketId).emit('on-message-from-new-channel', data.channel)
    })

    socket.on('emit-message', (data) => {
        io.of('/app').to(data.channel.id).emit('on-message', data)
    })

    socket.on('emit-typing', (data) => {
        if (data.userId === -1) {
            socket.to(data.channelId).emit('on-typing', {channelId: data.channelId, user: -1})
        } else {
            socket.to(data.channelId).emit('on-typing', {channelId: data.channelId, user: data.userId})
        }
    })

    socket.on('emit-member-removed', (data) => {
        io.of('/app').to(data.socketId).emit('on-member-removed', data.notification)
    })

    socket.on('disconnect', function(){
        deleteState(socket.company, socket.user, socket.id)
        .then((result) => {
            io.of('/app').to(socket.company).emit('on-offline', {user: socket.user})
        })
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

app.use(cors({origin: 'https://hermes-chat-app.herokuapp.com'}))
app.use(registerRouter)
app.use(authRouter)
app.use(backofficeRouter)
app.use(userRouter)
app.use(feedRouter)
app.use(channelRouter)
app.use(notificationRouter)

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

const deleteState = async (companyId, userId, socketId) => {
    return new Promise((resolve, reject) => {
        State.deleteOne({ companyId: companyId, userId: userId, socketId: socketId }, function (error, res) {
            if (error) {
                reject(error)
            } else {
                resolve(true)
            }
        });
    })
}
