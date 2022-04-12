const jwt = require('jsonwebtoken')

exports.isAuthenticated = (req, res, next) => {

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"]

    if (!token) {
        return res.status(403).json({
            success: false,
            message: "you are not authenticated."
        })
    }

    try {
        const decode = jwt.verify(token, "$%jwt&^&token$$%key")
        req.user = decode
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "invalid token."
        })
    }

    return next()
}
