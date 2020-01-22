const express = require('express');

const controller = require('../controllers/api');

const router = express.Router();

router.post('/login', controller.login)

router.post('/signup', controller.signup)

router.post('/forgotPassword', controller.forgotPassword)

router.post('/tickets', controller.postTickets)

router.post('/schedule', )

router.post('/tradePoints', )

router.post('/contactUs', )

router.post('/contactUs/feedback', )

router.post('/tickets', )

module.exports = router