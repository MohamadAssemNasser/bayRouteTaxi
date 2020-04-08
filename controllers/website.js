const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

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