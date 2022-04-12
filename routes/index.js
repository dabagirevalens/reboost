const router = require('express').Router()

const memberRoutes = require('./memberRoutes')
const userRoutes = require('./userRoutes')
const blogRoutes = require('./blogRoutes')
const commentRoutes = require('./commentRoutes')

router.use('/admin/members', memberRoutes)
router.use('/users', userRoutes)
router.use('/admin/blogs', blogRoutes)
router.use('/comments', commentRoutes)

module.exports = router