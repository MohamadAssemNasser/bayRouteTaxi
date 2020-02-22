const express = require('express')
const {
    body
} = require('express-validator');

const controller = require('../controllers/admin')
const auth = require('../middlewares/auth')

const router = express.Router();

let panelUserValidation = [
    body('firstName')
    .trim()
    .isLength({
        min: 2,
    }),
    body('lastName')
    .trim()
    .isLength({
        min: 2,
    }),
    body('phone', 'Invalid phone number')
    .trim()
    .isLength({
        min: 8,
    })
    .isNumeric(),
    body('email', 'Invalid email address')
    .trim()
    .isLength({
        min: 7,
    })
    .isEmail(),
    body('password', 'length must at least be 8')
    .trim()
    .isLength({
        min: 8, // change to 8 -- important --
    }),
    body('role', 'Invalid Role')
    .custom((value, {
        req
    }) => (value === 'Check In' || value === 'Data Entry'))
]

// -------------- GET --------------
router.get('/', auth.proceedIfLoggedIn, controller.getDashboard)

router.get('/login', auth.preventIfLoggedIn, controller.getLogin)

router.get('/users', auth.proceedIfLoggedIn, auth.isAdmin, controller.getUsers)

// -------------- POST --------------
router.post('/logout', auth.proceedIfLoggedIn, controller.postLogout)

router.post('/login', [
    body('email')
    .isLength({
        min: 7,
    })
    .trim()
    .isEmail(),
    body('password')
    .isLength({
        min: 3, // change to 8 -- important --
    })
    .trim()
], controller.postLogin)

// -------------- ADMIN APIs --------------

router.get('/site/all-panel-users',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getAllPanelUsers
)

router.post('/site/add-panel-user',
    panelUserValidation,
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.addPanelUser
)

router.get('*', (req, res) => res.redirect('/'))

module.exports = router