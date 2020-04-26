const express = require('express');
const {
    body
} = require('express-validator');


let registration = [
    body('name', 'Invalid Name')
    .trim()
    .notEmpty()
    .isAlpha(),
    body('email', 'Invalid email address')
    .trim()
    .normalizeEmail()
    .isEmail()
    .notEmpty(),
    body('password', 'Invalid Password')
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .isLength({
        min: 8
    }),
    body('phone')
    .trim()
    .isNumeric()
    .isLength({
        min: 8
    })
    .notEmpty()
]

const controller = require('../controllers/api');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        api: 'BayRoute Taxi API'
    })
})

// router.post('/login', controller.login)

router.post('/register', registration, controller.register)

// router.post('/forgotPassword', controller.forgotPassword)

// router.post('/tickets/create', controller.postTickets)

// router.post('/schedule', )

// router.post('/tradePoints', )

// router.post('/contactUs', )

// router.post('/contactUs/feedback', )

// router.post('/tickets', )

router.get('*', (req, res, next) => next())

module.exports = router