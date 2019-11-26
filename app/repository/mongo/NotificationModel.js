const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  company_id: {
    type: Number,
    required: [true, 'CompanyId is required']
  },
  user_id: {
    type: Number,
    required: [true, 'UserId is required']
  },
  channel_id: {
    type: Number,
    required: [true, 'UserId is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  at: {
    type: String,
    required: [true, 'At is required']
  },
  viewed: {
    type: Number,
    required: [true, 'UserId is required']
  }
})

module.exports = mongoose.model('notification', notificationSchema)