const User = require('../models/userModel')

const jwt = require('jsonwebtoken')
const router = require('express').Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.AUTH2_CLIENT_ID);

//github auth
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackUrl: `${process.env.CALLBACK_URL}/users/github/callback`,
        }, async function (accessToken, refreshToken, profile, cb) {
            let user = await User.findOne({ id: profile.id })

            if (!user) {
                user = new User({
                    id: profile.id,
                    name: profile.displayName,
                    avatar: profile.photos[0].value,
                })
                await user.save()
            }

            cb(null, user)
        }
    ))

router.get('/signin/github', passport.authenticate('github'))

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        const token = jwt.sign(
            {
                id: req.user._id,
                name: req.user.name,
            }
            , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
            {
                expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
            }
        )

        return res.status(200).json({
            success: true,
            token
        })
    })



//google auth
passport.use(new GoogleStrategy(
    {
        clientID: process.env.AUTH2_CLIENT_ID,
        clientSecret: process.env.AUTH2_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL}/users/google/callback`,
    }, async function (token, tokenSecret, profile, done) {
        let user = await User.findOne({ id: profile.id })

        if (!user) {
            user = new User({
                id: profile.id,
                name: profile.displayName,
                avatar: profile.photos[0].value,
            })
            await user.save()
        }

        return done(null, user)
    }
))

router.get('/signin/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '', failureMessage: true }),
    function (req, res) {
        const token = jwt.sign(
            {
                id: req.user._id,
                name: req.user.name,
            }
            , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
            {
                expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
            }
        )

        return res.status(200).json({
            success: true,
            token
        })
    }
)

// router.post('/signin/google', (req, res) => {

//     let auth_token = req.body.token
//     async function verify() {
//         const ticket = await client.verifyIdToken({
//             idToken: auth_token,
//         });
//         const payload = ticket.getPayload();

//         let user = await User.findOne({ id: payload.sub })

//         if (!user) {
//             user = new User({
//                 id: payload.sub,
//                 name: payload.name,
//                 avatar: payload.picture
//             })
//         }

//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 name: user.name,
//             }
//             , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
//             {
//                 expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
//             }
//         )

//         return res.status(200).json({
//             success: true,
//             token
//         })
//     }
//     verify().catch(err => {
//         return res.status(err.statusCode).json({
//             success: false,
//             message: err.message
//         })
//     });
// })



//linkedin auth


passport.use(new LinkedInStrategy(
    {
        clientID: process.env.LINKED_IN_CLIENT_ID,
        clientSecret: process.env.LINKED_IN_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL}/users/linkedin/callback`,
        scope: ['r_emailaddress', 'r_liteprofile'],
    }, async function (token, tokenSecret, profile, done) {
        let user = await User.findOne({ id: profile.id })

        if (!user) {
            user = new User({
                id: profile.id,
                name: profile.displayName,
                avatar: profile.photos[0].value,
            })
            await user.save()
        }

        return done(null, user)
    }
))

router.get('/signin/linkedin', passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile'],
}));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        // successRedirect: '/dashboard',
        failureRedirect: '/login'
    }), function (req, res) {
        const token = jwt.sign(
            {
                id: req.user._id,
                name: req.user.name,
            }
            , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
            {
                expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
            }
        )

        return res.status(200).json({
            success: true,
            token
        })
    })

//facebook auth
passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL}/users/facebook/callback`,
    }, async function (token, tokenSecret, profile, done) {
        let user = await User.findOne({ id: profile.id })
        console.log(user)
        console.log(profile)
        return done(null, user)
    }
))

router.get('/signin/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '' }),
    function (req, res) {
        const token = jwt.sign(
            {
                id: req.user._id,
                name: req.user.name,
            }
            , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
            {
                expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
            }
        )

        return res.status(200).json({
            success: true,
            token
        })
    }
)



router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router