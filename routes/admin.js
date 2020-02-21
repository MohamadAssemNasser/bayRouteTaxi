const express = require('express')
const {
    body
} = require('express-validator');

const controller = require('../controllers/admin')
const auth = require('../middlewares/auth')

const router = express.Router();

// -------------- GET --------------
router.get('/', auth.proceedIfLoggedIn, controller.getDashboard)

router.get('/login', auth.preventIfLoggedIn, controller.getLogin)

router.get('/users', auth.proceedIfLoggedIn, auth.isAdmin, controller.getUsers)

// -------------- POST --------------
router.post('/logout', auth.proceedIfLoggedIn, controller.postLogout)

router.post('/login', [
    body('email')
    .isLength({
        min:1, // change to email only -- imoprtant --
    })
    .trim(),
    body('password')
    .isLength({
        min: 1, // change to 8 -- important --
    })
    .trim()
], controller.postLogin)

router.post('/register-panel-user', controller.registerPanelUser)

router.get('*', (req, res) => res.redirect('/'))

module.exports = router