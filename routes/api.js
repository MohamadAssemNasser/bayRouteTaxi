const express = require('express');
const {
    body
} = require('express-validator');

const controller = require('../controllers/api');
const router = express.Router();

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

router.get('/', (req, res) => {
    res.status(200).json({
        api: 'BayRoute Taxi API'
    })
})

router.post('/test', (req, res) => {
    console.log('data', req.body.data)
    res.status(201).json({
        data: req.body.data
    })
})

// router.post('/login', controller.login)

router.post('/register', registration, controller.register)

// router.post('/forgotPassword', controller.forgotPassword)

// router.post('/tickets/create', controller.postTickets)

router.get('*', (req, res, next) => res.json({ error: 'Invalid Api Route' }))

module.exports = router