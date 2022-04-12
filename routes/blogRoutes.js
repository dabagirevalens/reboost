const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')
const upload = require('../config/multer')

const {
    newBlog,
    singleBlog,
    allBlogs,
    updateBlog,
    deleteBlog
} = require('../controllers/blogControllers')

router.route('/new').post(isAuthenticated, isAdmin('owner'), upload.single('image'), newBlog)


router.route('/:blogId')
    .get(isAuthenticated, singleBlog)
    .patch(isAuthenticated, isAdmin('owner'), upload.single('image'), updateBlog)
    .delete(isAuthenticated, isAdmin('owner'), deleteBlog)


router.route('').get(allBlogs)

module.exports = router