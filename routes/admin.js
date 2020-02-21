const express = require('express')
const {
    check,
    body
} = require('express-validator');

const controller = require('../controllers/admin')
const auth = require('../middlewares/auth')

const router = express.Router();

router.get('/login', auth.preventIfLoggedIn, controller.getLogin)

router.post('/login', auth.proceedIfLoggedIn, [
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

module.exports = router