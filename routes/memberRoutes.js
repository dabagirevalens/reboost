const router = require('express').Router()

const { isAuthenticated } = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

const upload = require('../config/multer')

const {
    newMember,
    getMember,
    updateMemberInfo,
    deleteMember,
    allMembers,
    login
} = require('../controllers/memberControllers')

router.route('/new').post(isAuthenticated, isAdmin('owner'), upload.single('profile'), newMember)

router.route('').get(allMembers)
router.route('/:id')
    .get(getMember)
    .patch(isAuthenticated, isAdmin('owner'), upload.single('profile'), updateMemberInfo)
    .delete(isAuthenticated, isAdmin('owner'), deleteMember)


router.route('/login').post(login)
module.exports = router