const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ROLES = require('../data/Roles')
const db = require('../repository/mysql/loginQueries')

const loginController = {}

loginController.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})

    db.getCredentials(email)
    .then(async(result) => {
        if (result.length === 0 || result[0].password === null) return res.status(404).json({date: moment().format(), code: 404, message: 'Invalid email or password.'})
        const validPassword = await bcrypt.compare(password, result[0].password);
        if (!validPassword) {
            return res.status(400).json({date: moment().format(), code: 400, message: 'Invalid email or password.'})
        }
        const user = result[0]
        let exp = 60 * 60 * 24;
        const user_role = ROLES.getRoleById(user.role_id)
        let token = jwt.sign({id: user.id}, 'Secret Password', { expiresIn: exp })
        res.status(200).json({user: user, token: token})
    })
    .catch((error) => {
        res.status(500).json({date: moment().format(), code: 500, message: error.message})
    })
}

loginController.secure = (req, res) => {
    let token = req.headers['authorization']

    if (!token) return res.status(401).json({date: moment().format(), code: 400, message: 'Missing token'})
    
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'Secret Password', (err, user) => {
        if (err) return res.status(401).json({date: moment().format(), code: 400, message: 'Invalid token.'})
        return res.status(200).json({date: moment().format(), code: 200, message: user})
      })
}

module.exports = loginController;