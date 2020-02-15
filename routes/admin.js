const express = require('express')
const {
    check,
    body
} = require('express-validator/check');

const controller = require('../controllers/admin')

const router = express.Router();

router.get('/login',
    [
        body('username')
        .trim(),
        body('password', 'Password has to be valid.')
        .isLength({
            min: 8,
        })
        .isAlphanumeric()
        .trim()
    ], controller.getLogin)

router.post('/login', controller.postLogin)

module.exports = router