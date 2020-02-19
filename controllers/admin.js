const mongodb = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator')

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
    let username = req.body.username
    let password = req.body.password
    const errors = validationResult(req)
    console.log('Errors' + errors.array()[0])
    if (!req.body.password && !req.body.username) {
        return res.render('admin/login', { // status needed --important --
            path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Fill in all the inputs',
              oldInput: {
                username: username,
                password: password
              },
              validationErrors: []
        })
    }
    console.log('postLogin')
    try {
        console.log('Errorsssss' , errors)
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: errors.array()[0].msg,
              oldInput: {
                username: username,
                password: password
              },
              validationErrors: errors.array()
            })
          }
          // console.log(errors)
        // check if email exists
        let user = await User.findBy({username : username})
        if (!user) {
            return res.status(422).render('admin/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Invalid username or password.',
              oldInput: {
                username: username,
                password: password
              },
              validationErrors: []
            })
        }
        user = new User(user)
        // check password
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              console.log(err)
              res.redirect('/bbc')
            })
          }
          return res.status(422).render('admin/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid username or password.',
            oldInput: {
              username: username,
              password: password
            },
            validationErrors: []
          })
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    } catch (err) {
        const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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