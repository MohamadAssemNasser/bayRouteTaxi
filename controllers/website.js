const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const Feedback = require('../models/feedback')
const TripType = require('../models/tripType')
const Station = require('../models/station')

exports.getHome = (req, res, next) => {
    return res.render('website/home')
}

exports.getAboutUs = (req, res, next) => {
    return res.render('website/about-us')
}

exports.getTicketsAndOffers = async(req, res, next) => {
    let tripTypes = await TripType.getAll()
    console.log('tripTypes: ', tripTypes)
    let stations = await Station.getAll()
    console.log('stations: ', stations)
    return res.render('website/trips-offers', {
        stations: stations,
        tripTypes: tripTypes
    })
}

exports.getDestinations = (req, res, next) => {
    return res.render('website/home')
}

exports.getSchedule = async(req, res, next) => {
    let stations = await Station.getAll()
    return res.render('website/schedule', {
        stations: stations
    })
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

exports.getAllTrips = async(req, res, next) => {
    db = getDb()
    try {
        let trips = await db.collection('trips').aggregate([{
                $lookup: {
                    from: 'stations',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'from'
                }
            },
            {
                $lookup: {
                    from: 'stations',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'to'
                }
            },
            {
                $unwind: {
                    path: "$from",
                    includeArrayIndex: "1"
                }
            },
            {
                $unwind: {
                    path: "$to",
                    includeArrayIndex: "1"
                }
            },
            {
                $project: {
                    _id: 1,
                    days: 1,
                    from: "$from.name",
                    to: "$to.name",
                    departureTime: 1,
                    arrivalTime: 1,
                    type: 1
                }
            }
        ]).toArray()
        return res.send(trips)
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            errorMessage: err
        })
    }
}