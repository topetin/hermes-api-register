const moment = require('moment')
const db = require('../repository/mysql/userQueries')
const emailService = require('../services/emailService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {}

userController.changeProfilePicture = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({ date: moment().format(), code: 400, message: 'Missing token' })

    const authId = await verifyToken(token)
        .then((auth) => {
            return auth.id
        })
        .catch((error) => {
            res.status(401).json({ date: moment().format(), code: 400, message: error.message });
        })

    const profile_img = req.body.profile_img

    db.changeProfileImg(authId, profile_img)
        .then(
            (result) => {
                db.getUser(authId)
                    .then(
                        (data) => {
                            res.status(200).json({ date: moment().format(), code: 200, message: data[0] })
                        }
                    )
                    .catch(
                        (error) => res.status(500).json({ date: moment().format(), code: 500, message: error.message })
                    )
            }
        )
        .catch(
            (error) => res.status(500).json({ date: moment().format(), code: 500, message: error.message })
        )

}

userController.changePassword = async (req, res) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({ date: moment().format(), code: 400, message: 'Missing token' })

    const authId = await verifyToken(token)
        .then((auth) => {
            return auth.id
        })
        .catch((error) => {
            res.status(401).json({ date: moment().format(), code: 400, message: error.message });
        })

    const password_current = req.body.password_current
    const password_new = req.body.password_new

    if (password_current === password_new) return res.status(400).json({date: moment().format(), code: 400, message: 'Current and new password cant be the same'})
    if (!password_current || !password_new) return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_new, salt)

    db.getPassword(authId)
    .then(
        async(result) => {
            const validPassword = await bcrypt.compare(password_current, result[0].password);
            if (!validPassword) {
                return res.status(400).json({date: moment().format(), code: 400, message: 'Current password is not correct.'})
            }
            db.updatePassword(authId, hashedPassword)
            .then(
                (result) => res.status(200).json({date: moment().format(), code: 200, message: true})
            )
            .catch(
                (error) => res.status(500).json({ date: moment().format(), code: 500, message: error.message })
            )
        }
    )
    .catch(
        (error) => res.status(500).json({ date: moment().format(), code: 500, message: error.message })
    )
}

userController.changeName = (req, res) => {

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