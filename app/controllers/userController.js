const db = require('../repository/mysql/userQueries')
const responseHandler = require('../utils/ResponseHandler')
const Feed = require('../repository/mongo/feedModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {}

userController.getUser = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    db.getUser(authId)
    .then((result) => responseHandler.send200(res, result[0]))
    .catch((error) => responseHandler.serverError(res, error))

}

userController.changeProfilePicture = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const profile_img = req.body.profile_img
    if (!profile_img) return responseHandler.missingRequiredParameters(res)

    db.changeProfileImg(authId, profile_img)
        .then((result) => {
                db.getUser(authId)
                    .then(
                        (data) => responseHandler.send200(res, data[0]))
                    .catch((error) => responseHandler.serverError(res, error))
            }
        )
        .catch((error) => responseHandler.serverError(res, error))

}

userController.changePassword = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const password_current = req.body.password_current
    const password_new = req.body.password_new

    if (password_current === password_new) return responseHandler.send400(res, 'Current and new password cant be the same')
    if (!password_current || !password_new) return responseHandler.missingRequiredParameters(res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_new, salt)

    db.getPassword(authId)
    .then(
        async(result) => {
            const validPassword = await bcrypt.compare(password_current, result[0].password);
            if (!validPassword) return responseHandler.send400(res, 'Current password is not correct.')
            db.updatePassword(authId, hashedPassword)
            .then((result) => responseHandler.send200(res, true))
            .catch((error) => responseHandler.serverError(res, error))
        }
    )
    .catch((error) => responseHandler.serverError(res, error))
}

userController.changeName = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const name_new = req.body.name_new

    if (!name_new) return responseHandler.missingRequiredParameters(res);

    db.changeName(authId, name_new)
    .then((result) => {
        db.getUser(authId)
        .then(
            (data) => responseHandler.send200(res, data[0]))
        .catch((error) => responseHandler.serverError(res, error))
    })
    .catch((error) => responseHandler.serverError(error))
}

userController.getCompanyFeed = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

        try {
            db.getCompanyByUser(authId)
            .then(async (result) => {
                const feeds = await Feed.find({ company_id: result[0].id })
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                responseHandler.send200(res, {feeds: feeds, company: {id: result[0].id, profile_img: result[0].profile_img, name: result[0].name}})
            })
            .catch((error) => responseHandler.serverError(res, error))
        }
        catch(e) {
            responseHandler.serverError(res, e)
        }
}

userController.getCompanyUsers = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    try {
        db.getCompanyByUser(authId)
        .then((result) => {
            db.listUsers(result[0].id, authId)    
            .then((result) => responseHandler.send200(res, result.length === 0 ? [] : result))
            .catch((error) => responseHandler.serverError(res, error))
        })
        .catch((error) => responseHandler.serverError(res, error))
    }
    catch(e) {
        responseHandler.serverError(res, e)
    }
}

userController.search = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const searchString = req.query.searchString
    const users = []
    const channels = []

    try {
        db.getCompanyByUser(authId)
        .then((result) => {            
            db.getUserByString(result[0].id, authId, searchString)    
            .then((result) => 
            {
                result.length === 0 ? null : users.push(result)
                db.getChannelByString(authId, searchString)
                .then((result2) => {
                    result2.length === 0 ? null : channels.push(result2)
                    responseHandler.send200(res, {users: users.length > 0 ? users[0] : [], channels: channels.length > 0 ? channels[0] : []})
                })
                .catch((error) => responseHandler.serverError(res, error))
            })
            .catch((error) => responseHandler.serverError(res, error))
            
        })
        .catch((error) => responseHandler.serverError(res, error))
    }
    catch(e) {
        responseHandler.serverError(res, e)
    }
}

const verifyToken = async (token) => {
    token = token.replace('Bearer ', '')
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'Secret Password', (err, user) => {
            if (err) return reject(err);
            return resolve(user);
        })
    })
}

module.exports = userController;