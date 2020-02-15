const mongodb = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    validationResult
} = require('express-validator/check')

const User = require('../models/user')
const getDb = require('../util/database').getDb

let db

exports.getLogin = async (req, res, next) => {
    let message = req.flash('error')
    console.log(message)
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('admin/login', {
        pageTitle: 'ISM :: Admin Panel',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
}

exports.postLogin = async (req, res, next) => {
    db = getDb()
    if (!req.body.password && !req.body.email) {
        return res.render('admin/login', { // status needed --important --
            error: true,
            errorMessage: 'Missing request parameters'
        })
    }
    try {
        let email = req.body.email
        let password = req.body.password
        // check if email exists
        let user = await db.collection('users').findOne({
            email: {
                $eq: email
            }
        })
        if (!user) {
            return res.status(500).send({ // status needed --important--
                error: true,
                errorMessage: 'No account found associated with this email address'
            })
        }
        user = new User(user)
        // check password
        if (await bcrypt.compare(password, user.password)) {
            // generating token
            if (!user.token) {
                user.token = await jwt.sign({
                    userId: user._id
                }, process.env.privateKey, {
                    algorithm: 'HS256'
                }) // need to be changed to RS with ssl --important--
                await db.collection('users').updateOne({
                    email: {
                        $eq: email
                    }
                }, {
                    $set: {
                        token: user.token
                    }
                })
            }
            return res.status(200).send({ // status needed --important--
                error: false,
                token: user.token
            })
        } else {
            return res.send({ // status needed --important--
                error: true,
                errorMessage: 'The password you entered is incorrect'
            })
        }
    } catch (err) {
        return res.status(500).send({
            error: true,
            errorMessage: err
        })
    }
}

exports.signup = async (req, res, next) => {
    db = getDb()
    if (!req.body.name && !req.body.password && !req.body.email) {
        return res.send({
            error: true,
            errorMessage: 'Missing request parameters'
        })
    }
    try {
        let user = new User({ // validate data --important--
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        })
        // check if email exists
        let u = await db.collection('users').findOne({
            email: {
                $eq: user.email
            }
        })
        if (u) {
            return res.status(500).send({ // status needed --important--
                error: true,
                errorMessage: 'An account with the same email address already exists'
            })
        }
        // password hashing
        bcrypt.hash(user.password, process.env.salt,
            async (err, hash) => {
                if (err) {
                    throw err
                }
                user.password = hash
                // adding user
                user = await db.collection('users').insertOne(user)
                user = user.ops[0]
                console.log(user)
            })
        // response
        return res.status(200).send({
            error: false,
            message: 'User created successfully'
        })
    } catch (err) {
        return res.status(500).send({
            error: true,
            errorMessage: err
        })
    }
}