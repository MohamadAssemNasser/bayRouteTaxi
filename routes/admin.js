const express = require('express')
const {
    check,
    body
} = require('express-validator');

const controller = require('../controllers/admin')

const router = express.Router();

router.get('/login', controller.getLogin)

router.post('/login',[
    body('username')
    .isLength({
        min:3,
    })
    .trim(),
    body('password')
    .isLength({
        min: 8,
    })
    .isAlphanumeric()
    .trim()
], controller.postLogin)

module.exports = router