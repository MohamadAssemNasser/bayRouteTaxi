const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const Feedback = require('../models/feedback')

exports.getHome = (req, res, next) => {
    return res.render('website/home')
}

exports.getAboutUs = (req, res, next) => {
    return res.render('website/about-us')
}

exports.getTicketsAndOffers = (req, res, next) => {
    return res.render('website/home')
}

exports.getDestinations = (req, res, next) => {
    return res.render('website/home')
}

exports.getSchedule = (req, res, next) => {
    return res.render('website/home')
}

exports.getContactUs = (req, res, next) => {
    return res.render('website/contact-us')
}

exports.postFeedback = async(req, res, next) => {
    db = getDb()
    let f = new Feedback({
        name: req.body.name,
        email: req.body.email,
        option: req.body.option,
        message: req.body.message
    })
    try {
        await Feedback.addOne(f)
        return res.send({
            message: 'Submitted successfully'
        })
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}