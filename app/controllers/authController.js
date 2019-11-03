const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responseHandler = require('../utils/ResponseHandler')
const db = require('../repository/mysql/loginQueries')

const loginController = {}

loginController.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) return responseHandler.missingRequiredParameters(res);

    db.getCredentials(email)
    .then(async(result) => {
        if (result.length === 0 || result[0].password === null) return responseHandler.send404(res, 'Invalid email or password.');
        const validPassword = await bcrypt.compare(password, result[0].password);
        if (!validPassword) {
            return responseHandler.send400(res, 'Invalid email or password.')
        }
        const user = result[0]
        let exp = 60 * 60 * 24;
        let token = jwt.sign({id: user.id}, 'Secret Password', { expiresIn: exp })
        res.status(200).json({user: user, token: token})
    })
    .catch((error) => responseHandler.serverError(res, error))
}

loginController.secure = (req, res) => {
    let token = req.headers['authorization']

    if (!token) return responseHandler.missingToken(res);
    
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'Secret Password', (err, user) => {
        if (err) return responseHandler.invalidToken(res)
        return responseHandler.send200(res, user)
      })
}

module.exports = loginController;