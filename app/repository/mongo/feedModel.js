const mongoose = require('mongoose')

const feedSchema = new mongoose.Schema({
  company_id: {
    type: Number,
    required: [true, 'CompanyId is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  at: {
    type: String,
    required: [true, 'At is required']
  }
})

module.exports = mongoose.model('feed', feedSchema)