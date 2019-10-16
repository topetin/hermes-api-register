const mongoose = require('mongoose')

const sessionStorageSchema = new mongoose.Schema({
  companyId: {
    type: Number,
    required: [true, 'CompanyId is required']
  },
  sessionToken: {
    type: String,
    required: [true, 'Session token is required']
  }
})

module.exports = mongoose.model('sessionStorage', sessionStorageSchema)