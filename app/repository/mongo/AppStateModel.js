const mongoose = require('mongoose')

const AppStateSchema = new mongoose.Schema({
  companyId: {
    type: Number,
    required: [true, 'CompanyId is required']
  },
  userId: {
    type: Number,
    required: [true, 'UserId is required']
  },
  socketId: {
    type: String,
    required: [true, 'SocketId is required']
  }
})

module.exports = mongoose.model('appState', AppStateSchema)