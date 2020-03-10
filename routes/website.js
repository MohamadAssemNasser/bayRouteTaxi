const express = require('express');

const controller = require('../controllers/website');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('<h1>HELLOOOOOOO</h1>')
})

// router.get('/login', )

// router.get('/signup', )

// router.get('/forgotUsername', )

// router.get('/forgotPassword', )

// router.get('/aboutUs', )

// router.get('/tickets&offers', )

// router.get('/schedule', )

// router.get('/tradePoints', )

// router.get('/contactUs', )

// router.post('/contactUs/feedback', )

module.exports = router