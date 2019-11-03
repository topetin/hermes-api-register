const moment = require('moment')

const responseHandler = {}

responseHandler.missingRequiredParameters = (res) => {
   return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})
}

responseHandler.missingToken = (res) => {
    return res.status(401).json({date: moment().format(), code: 401, message: 'Missing token'})
 }

 responseHandler.invalidToken = (res) => {
    return res.status(401).json({date: moment().format(), code: 401, message: 'Invalid token'})
 }

 responseHandler.serverError = (res, err) => {
    return res.status(500).json({date: moment().format(), code: 500, message: err.message})
 }

 responseHandler.send200 = (res, message) => {
    return res.status(200).json({date: moment().format(), code: 200, message: message})
 }

 responseHandler.send400 = (res, message) => {
    return res.status(400).json({date: moment().format(), code: 400, message: message})
 }

 responseHandler.send404 = (res, message) => {
    return res.status(404).json({date: moment().format(), code: 404, message: message})
 }

 responseHandler.send403 = (res, message) => {
    return res.status(403).json({date: moment().format(), code: 403, message: message})
 }

module.exports = responseHandler;