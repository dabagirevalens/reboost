module.exports = isAdmin = (...position) => {

    return (req, res, next) => {

        if (!position.includes(req.user.position)) {
            return res.status(403).json({
                success: false,
                message: 'You can not access this resource.'
            })
        }

        next()
    }
}