const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log("Middleware");
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}