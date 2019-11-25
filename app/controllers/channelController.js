const db = require('../repository/mysql/channelQueries')
const userQueries = require('../repository/mysql/userQueries')
const responseHandler = require('../utils/ResponseHandler')
const State = require('../repository/mongo/AppStateModel')
const Message = require('../repository/mongo/MessageModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const channelController = {}

channelController.createChannel = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const type = req.body.type
    const title = req.body.title
    const members = req.body.members

    if (!type || !title || !members) return responseHandler.missingRequiredParameters(res)

    let membersToAdd = []

    userQueries.getUser(authId)
    .then((result) => {
        if (result[0].role_id !== 2 && type === 'G') {
            return responseHandler.send403(res, 'You must be and ADMINISTRATOR to create a new channel')
        }
        db.createChannel(authId, type, title)
        .then((result) => {
            members.map(id => membersToAdd.push([id, result.insertId]))
            db.addUserToChannel(membersToAdd)
                .then((result2) => {
                    responseHandler.send200(res, {id: result.insertId, owner_id: authId, type: type, title: title})
                })
                .catch((error => responseHandler.serverError(res, error)));
    
        })
        .catch((error => responseHandler.serverError(res, error)));
    })
    .catch((error => responseHandler.serverError(res, error)));
}

channelController.getChannels = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    db.listChannels(authId)
        .then((result) => responseHandler.send200(res, result.length === 0 ? [] : result))
        .catch((error => responseHandler.serverError(res, error)));
}

channelController.getChannelInfo = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const channelId = req.query.channelId;

    const channelInfo = []

    db.getChannelMemebersInfo(channelId)
    .then((result) => {
        if (result.length !== 0) {
            result.map((item) => {
                let o = Object.assign({}, item);
                o.role_in_channel = 'member'
                channelInfo.push(o);
            })
        }
        db.getChannelOwnerInfo(channelId)
        .then((result2) => {
            if (result2.length !== 0) {
                result2.map((item) => {
                    let f = Object.assign({}, item);
                    f.role_in_channel = 'owner'
                    channelInfo.push(f);
                })
            }
            responseHandler.send200(res, channelInfo.length === 0 ? [] : channelInfo)
        })
        .catch((error) => responseHandler.serverError(res, error))
        
    })
    .catch((error) => responseHandler.serverError(res, error))
}

channelController.removeMember = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const memberId = req.body.userId;
    const channelId = req.body.channelId;

    userQueries.getUser(authId)
    .then((result) => {
        if (result[0].role_id !== 2) {
            return responseHandler.send403(res, 'You must be and ADMINISTRATOR to create a new channel')
        }
    db.removeUserFromChannel(memberId, channelId)
    .then((result) => responseHandler.send200(res, true))
    .catch((error) => responseHandler.serverError(res, error))
})
.catch((error => responseHandler.serverError(res, error)));
}

channelController.removeChannel = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const channelId = req.body.channelId;

    userQueries.getUser(authId)
    .then((result) => {
        if (result[0].role_id !== 2) {
            return responseHandler.send403(res, 'You must be and ADMINISTRATOR to create a new channel')
        }
        db.removeUserChannelById(channelId)
        .then((result) => {
            db.removeChannelById(channelId)
            .then((result) => responseHandler.send200(res, true))
            .catch((error) => responseHandler.serverError(res, error))
        })
        .catch((error) => responseHandler.serverError(res, error))
    })
    .catch((error => responseHandler.serverError(res, error)));
}

channelController.addMember = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const channelId = req.body.channelId;
    const memberId = req.body.userId;

    userQueries.getUser(authId)
    .then((result) => {
        if (result[0].role_id !== 2) {
            return responseHandler.send403(res, 'You must be and ADMINISTRATOR to create a new channel')
        }
        db.addUserToChannel([[memberId, channelId]])
        .then((result2) => responseHandler.send200(res, true))
        .catch((error) => responseHandler.serverError(res, error))
    })
    .catch((error => responseHandler.serverError(res, error)));
}

channelController.removeSingleChannel = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const channelId = req.body.channelId;
    const channelOwner = req.body.channelOwner;
    const channelMember = req.body.channelMember;
    const channelName = req.body.channelName;

    if (channelOwner === authId) {
        db.removeUserChannelById(channelId)
        .then((result) => {
            db.updateChannelOwner(channelId, channelMember, generateChannelName(channelName))
            .then((result2) => responseHandler.send200(res, true))
            .catch((error) => responseHandler.serverError(res, error))
        })
        .catch((error) => responseHandler.serverError(res, error))
    }

    if (channelOwner !== authId) {
        db.removeUserChannelById(channelId)
        .then((result) => responseHandler.send200(res, true))
        .catch((error) => responseHandler.serverError(res, error))
    }

}

const generateChannelName = (name) => {
    const arr = name.split('//')
    return arr[1] + '//' + arr[0]
} 

channelController.getAppState = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const companyId = req.query.companyId

    try {
        const state = await State.find({companyId: 'company'+companyId})
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        responseHandler.send200(res, state)
    }
    catch(e) {
        responseHandler.serverError(res, e)
    }
}

channelController.postMessage = async(req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))

    const companyId = req.body.companyId;
    const channelId = req.body.channelId;
    const message = req.body.message;

    try {
        const msg = new Message({
            company_id: companyId,
            channel_id: channelId,
            message: message,
            user_from_id: authId,
            at: moment().format()
        })
    
        await msg.save()
        responseHandler.send200(res, msg)
    }
    catch(e) {
        responseHandler.serverError(res, e)
    }
}

channelController.getChannelMessages = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);

    const authId = await verifyToken(token)
        .then((auth) => { return auth.id })
        .catch((error) => responseHandler.serverError(res, error))
    
    const channelId = req.query.channelId

    try {
        const messages = await Message.find({channel_id: channelId}).sort({'_id': 1})
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        responseHandler.send200(res, messages)
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

module.exports = channelController;