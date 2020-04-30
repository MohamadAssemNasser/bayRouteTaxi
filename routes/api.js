const express = require('express');
const {
    body
} = require('express-validator');

const controller = require('../controllers/api');
const router = express.Router();

let registration = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty'),
    body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .notEmpty()
    .withMessage('Email must not be empty'),
    body('password', 'Invalid Password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isAlphanumeric()
    .withMessage('Pasword must be alphanumeric')
    .isLength({
        min: 8
    })
    .withMessage('Pasword must be at least 8 in length')
]

router.get('/', (req, res) => {
    res.status(200).json({
        api: 'BayRoute Taxi API'
    })
})

router.get('/trips', controller.getTrips)

router.post('/register', registration, controller.register)

router.post('/login', [
    body('email')
    .trim(),
    body('password', 'Invalid Password')
    .trim()
], controller.login)

router.post('/resetPassword', controller.resetPassword)

router.get('/stations', controller.getStations)

// router.post('/tickets/create', controller.postTickets)

router.get('*', (req, res, next) => res.json({ error: 'Invalid Api Route' }))

module.exports = router