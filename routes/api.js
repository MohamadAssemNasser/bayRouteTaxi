const express = require('express');

const controller = require('../controllers/api');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        api: 'BayRoute Taxi API'
    })
})

// router.post('/login', controller.login)

// router.post('/signup', controller.signup)

// router.post('/forgotPassword', controller.forgotPassword)

// router.post('/tickets/create', controller.postTickets)

// router.post('/schedule', )

// router.post('/tradePoints', )

// router.post('/contactUs', )

// router.post('/contactUs/feedback', )

// router.post('/tickets', )

router.get('*', (req, res, next) => next())

module.exports = router