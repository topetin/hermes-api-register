const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../repository/mysql/loginQueries')

const loginController = {}

loginController.login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) return res.status(400).json({date: moment().format(), code: 400, message: 'Missing required parameters'})

    db.getCredentials(username)
    .then(async(result) => {
        if (result.length === 0) return res.status(404).json({date: moment().format(), code: 404, message: 'Invalid email or password.'})
        const validPassword = await bcrypt.compare(password, result[0].password);
        if (!validPassword) {
            return res.status(400).json({date: moment().format(), code: 400, message: 'Invalid email or password.'})
        }
        let token = jwt.sign({username: username}, 'Secret Password', { expiresIn: 60 * 60 * 24 })
        res.status(200).json({date: moment().format(), code: 200, message: token})
    })
    .catch((error) => {
        res.status(500).json({date: moment().format(), code: 500, message: error.message})
    })
}

loginController.secure = (req, res) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({date: moment().format(), code: 400, message: 'Missing token'})
    
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'Secret Password', (err, user) => {
        if (err) return res.status(401).json({date: moment().format(), code: 400, message: 'Invalid token.'})
        return res.status(200).json({date: moment().format(), code: 200, message: true})
      })
}

module.exports = loginController;