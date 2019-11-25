const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  company_id: {
    type: Number,
    required: [true, 'CompanyId is required']
  },
  channel_id: {
    type: Number,
    required: [true, 'ChannelId is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  user_from_id: {
    type: Number,
    required: [true, 'UserFromId is required']
  },
  at: {
    type: String,
    required: [true, 'At is required']
  }
})

module.exports = mongoose.model('message', MessageSchema)