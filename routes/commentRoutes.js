const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

const { newComment, updateComment, deleteComment, deleteCommentAdmin, getCommentsByBlog } = require('../controllers/commentControllers')

router.route('/new').post(isAuthenticated, newComment)

router.route('/delete/:commentId').delete(isAuthenticated, isAdmin('owner'), deleteCommentAdmin)

router.route('/:commentId')
    .patch(isAuthenticated, updateComment)
    .delete(isAuthenticated, deleteComment)

router.route('/blog/:blogId').get(getCommentsByBlog)

module.exports = router