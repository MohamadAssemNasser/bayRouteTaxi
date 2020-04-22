const mongodb = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    validationResult
} = require('express-validator')
const nodemailer = require('nodemailer')

const User = require('../models/panel-user')
const Station = require('../models/station')
const TripType = require('../models/tripType')
const Trip = require('../models/trip')
const Feedback = require('../models/feedback')

const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

let db

// POST LOGOUT
exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}

// GET LOGIN
exports.getLogin = async(req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('admin/login', {
        pageTitle: 'BayRoute Taxi :: Admin Panel',
        errorMessage: message,
        oldInput: {
            email: ''
        },
        validationErrors: []
    })
}

// POST LOGIN
exports.postLogin = async(req, res, next) => {
    db = getDb()
    let email = req.body.email
    let password = req.body.password
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email
                },
                validationErrors: errors.array()
            })
        }
        // check if email exists
        let user = await db.collection('panel-users').findOne({
            $and: [{
                    email: {
                        $eq: email
                    }
                },
                {
                    role: {
                        $ne: 'Check In'
                    }
                }
            ]
        })
        if (!user) {
            return res.status(422).render('admin/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email
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
                        res.redirect('/')
                    })
                }
                return res.status(422).render('admin/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    oldInput: {
                        email: email
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

exports.redirectToProfile = (req, res, next) => {
    return res.redirect('/profile')
}

exports.getProfile = (req, res, next) => {
    return res.render('admin/profile', {
        pageTitle: 'BayRoute Taxi :: Profile',
        path: '/profile',
        user: req.user
    })
}

// GET TRIPS
exports.getTrips = async(req, res, next) => {
    db = getDb()
    let stations, tripTypes
    try {
        stations = await Station.getAll()
        tripTypes = await TripType.getAllUnique()
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
    return res.render('admin/trips', {
        pageTitle: 'BayRoute Taxi :: Trips',
        path: '/trips',
        user: {
            firstName: req.user.firstName,
            role: req.user.role,
        },
        stations: stations,
        tripTypes: tripTypes
    })
}

// GET USERS
exports.getUsers = (req, res, next) => {
    return res.render('admin/users', {
        pageTitle: 'BayRoute Taxi :: Users',
        path: '/users',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}

// GET STATIONS
exports.getStations = (req, res, next) => {
    return res.render('admin/stations', {
        pageTitle: 'BayRoute Taxi :: Stations',
        path: '/stations',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}

// * GET TRIP TYPES
exports.getTripTypes = (req, res, next) => {
    return res.render('admin/tripTypes', {
        pageTitle: 'BayRoute Taxi :: Trip Types',
        path: '/tripTypes',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}

exports.getFeedbacks = (req, res, next) => {
    return res.render('admin/feedbacks', {
        pageTitle: 'BayRoute Taxi :: Feedbacks',
        path: '/feedbacks',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}

exports.getIssues = (req, res, next) => {
    return res.render('admin/issues', {
        pageTitle: 'BayRoute Taxi :: Issues',
        path: '/issues',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}

exports.getBusinessPurposes = (req, res, next) => {
    return res.render('admin/business-purposes', {
        pageTitle: 'BayRoute Taxi :: Business Purposes',
        path: '/business-purposes',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}

exports.getFeatureRequests = (req, res, next) => {
    return res.render('admin/feature-requests', {
        pageTitle: 'BayRoute Taxi :: Feature Requests',
        path: '/feature-requests',
        user: {
            firstName: req.user.firstName,
            role: req.user.role
        }
    })
}


// ------------- APIs -------------

// GET ALL USERS
exports.getAllPanelUsers = async(req, res, next) => {
    db = getDb()
    try {
        let u = await db.collection('panel-users').find({
            role: {
                $ne: 'Administrator'
            }
        }).toArray()
        res.status(200).send(u)
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

// GET PANEL USER
exports.getPanelUser = async(req, res, next) => {
    db = getDb()
    try {
        let u = await db.collection('panel-users').findOne({
            _id: new ObjectId(req.params.userId)
        })
        res.json(u)
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

// GET STATIONS
exports.getAllStations = async(req, res, next) => {
    db = getDb()
    try {
        let stations = await Station.getAll()
        res.json(stations)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.getAllTripTypes = async(req, res, next) => {
    db = getDb()
    try {
        let tripTypes = await TripType.getAll()
        res.json(tripTypes)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

// GET STATION
exports.getStation = async(req, res, next) => {
    db = getDb()
    try {
        let s = await db.collection('stations').findOne({
            _id: new ObjectId(req.params.stationId)
        })
        res.json(s)
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            errorMessage: err
        })
    }
}

exports.getTripType = async(req, res, next) => {
    db = getDb()
    try {
        let s = await db.collection('tripTypes').findOne({
            _id: new ObjectId(req.params.tripTypeId)
        })
        res.json(s)
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            errorMessage: err
        })
    }
}

exports.getFeedbacksApi = async(req, res, next) => {
    try {
        let s = await Feedback.getAll(req.params.option)
            // console.log(s)
        return res.json(s)
    } catch (err) {
        console.log(err)
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

// POST REGISTER USERS
exports.addPanelUser = async(req, res) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }
        let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                phone: req.body.phone,
                email: req.body.email,
                role: req.body.role
            })
            // check if email exists
        let u = await db.collection('panel-users').findOne({
            email: {
                $eq: user.email
            }
        })
        if (u) {
            return res.json({ // status needed --important--
                error: true,
                validationErrors: [{
                    param: 'email',
                    msg: 'An account with the same email address already exists'
                }]
            })
        }
        // password hashing
        bcrypt.hash(user.password, 12,
                async(err, hash) => {
                    if (err) {
                        throw err
                    }
                    user.password = hash
                        // adding user
                    user = await db.collection('panel-users').insertOne(user)
                    user = user.ops[0]
                })
            // response
        return res.status(200).json({
            error: false,
            message: 'User created successfully'
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.deletePanelUser = async(req, res, next) => {
    db = getDb()
    try {
        let u = await db.collection('panel-users').deleteOne({
            _id: new ObjectId(req.body._id)
        })
        res.status(200).json(u)
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

exports.deleteStation = async(req, res, next) => {
    db = getDb()
    try {
        let s = await db.collection('stations').deleteOne({
            _id: new ObjectId(req.body._id)
        })
        res.status(200).json(s)
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

exports.deleteTripType = async(req, res, next) => {
    db = getDb()
    try {
        let s = await db.collection('tripTypes').deleteOne({
            _id: new ObjectId(req.body._id)
        })
        res.status(200).json(s)
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

exports.updatePanelUser = async(req, res, next) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }
        let u = await db.collection('panel-users').findOne({
            $and: [{
                    email: {
                        $eq: req.body.email
                    }
                },
                {
                    _id: {
                        $ne: new ObjectId(req.body._id)
                    }
                }
            ]
        })
        if (u) {
            return res.json({ // status needed --important--
                error: true,
                validationErrors: [{
                    param: 'email',
                    msg: 'An account with the same email address already exists'
                }]
            })
        }
        try {
            // Update User
            let u = await db.collection('panel-users').findOneAndUpdate({
                _id: {
                    $eq: new ObjectId(req.body._id)
                }
            }, {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    role: req.body.role
                }
            })
            if (u.value === null) {
                // response
                return res.json({ // status needed --important--
                    error: false,
                    message: 'User not found'
                })
            }
        } catch (err) {
            console.log(err)
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'User updated successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.updateProfile = async(req, res, next) => {
    if (req.user._id != req.params.userId) {
        return res.status(403).json({
            error: true,
            validationErrors: [{
                param: auth
            }]
        })
    }
    db = getDb()
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            // if (!errors[0].param === "role")
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }
        let u = await db.collection('panel-users').findOne({
            $and: [{
                    email: {
                        $eq: req.body.email
                    }
                },
                {
                    _id: {
                        $ne: new ObjectId(req.params.userId)
                    }
                }
            ]
        })
        if (u) {
            return res.json({ // status needed --important--
                error: true,
                validationErrors: [{
                    param: 'email',
                    msg: 'An account with the same email address already exists'
                }]
            })
        }
        try {
            // Update User
            let u = await db.collection('panel-users').findOneAndUpdate({
                _id: {
                    $eq: new ObjectId(req.params.userId)
                }
            }, {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone
                }
            })
            if (u.value === null) {
                // response
                return res.json({ // status needed --important--
                    error: false,
                    message: 'User not found'
                })
            }
        } catch (err) {
            console.log(err)
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'User updated successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.updateStation = async(req, res, next) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // * validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }

        let s = await db.collection('stations').findOne({
            $and: [{
                    name: {
                        $eq: req.body.name
                    }
                },
                {
                    _id: {
                        $ne: new ObjectId(req.body._id)
                    }
                }
            ]
        })
        if (s) {
            return res.json({ // ! status needed --important--
                error: true,
                validationErrors: [{
                    param: 'name',
                    msg: 'A Station with the same name already exists'
                }]
            })
        }

        try {
            // Update Station
            let u = await db.collection('stations').findOneAndUpdate({
                _id: {
                    $eq: new ObjectId(req.body._id)
                }
            }, {
                $set: {
                    name: req.body.name,
                }
            })
            if (u.value === null) {
                // response
                return res.json({ // status needed --important--
                    error: false,
                    message: 'Station not found'
                })
            }
        } catch (err) {
            console.log(err)
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'Station updated successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.updateTripType = async(req, res, next) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // * validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }

        let tripType = new TripType({
            name: req.body.name,
            deck: req.body.deck,
            ticketPrice: req.body.ticketPrice,
            numberOfSeats: req.body.numberOfSeats
        })

        let s = await db.collection('tripTypes').findOne({
            $and: [{
                    name: {
                        $eq: req.body.name
                    }
                },
                {
                    deck: {
                        $eq: req.body.deck
                    }
                },
                {
                    _id: {
                        $ne: new ObjectId(req.body._id)
                    }
                }
            ]
        })
        if (s) {
            return res.json({ // ! status needed --important--
                error: true,
                validationErrors: [{
                        param: 'name',
                        msg: 'A Trip Type with the same name and deck already exists'
                    },
                    {
                        param: 'deck',
                        msg: 'A Trip Type with the same name and deck already exists'
                    }
                ]
            })
        }

        try {
            // Update Station
            let u = await db.collection('tripTypes').findOneAndUpdate({
                _id: {
                    $eq: new ObjectId(req.body._id)
                }
            }, {
                $set: {
                    name: tripType.name,
                    deck: tripType.deck,
                    ticketPrice: tripType.ticketPrice,
                    numberOfSeats: tripType.numberOfSeats
                }
            })
            if (u.value === null) {
                // response
                return res.json({ // status needed --important--
                    error: false,
                    message: 'Trip Type not found'
                })
            }
        } catch (err) {
            console.log(err)
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'Trip Type updated successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.updatePanelUserPassword = async(req, res, next) => {
    console.log(req.params.userId)
    if (req.user._id != req.params.userId) {
        return res.status(403).json({
            error: true,
            validationErrors: [{
                param: auth
            }]
        })
    }
    const errors = validationResult(req)
        // * validate req data
    if (!errors.isEmpty()) {
        return res.json({
            error: true,
            validationErrors: errors.array()
        })
    }
    db = getDb()
    try {
        // password hashing
        bcrypt.hash(req.body.password, 12,
            async(err, hash) => {
                if (err) {
                    throw err
                }
                try {
                    let u = await db.collection('panel-users').findOneAndUpdate({
                        _id: {
                            $eq: new ObjectId(req.params.userId)
                        }
                    }, {
                        $set: {
                            password: hash
                        }
                    })
                    return res.status(200).json({
                        error: false,
                        message: 'Passsword reset successfully'
                    })
                } catch (error) {
                    console.log(error)
                    res.status(500).json({
                        error: true,
                        errorMessage: 'Internal server error'
                    })
                }
            })
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

exports.resetPanelUserPassword = async(req, res, next) => {
    db = getDb()
    try {
        // password hashing
        bcrypt.hash('12345678', 12,
            async(err, hash) => {
                if (err) {
                    throw err
                }
                try {
                    let u = await db.collection('panel-users').findOneAndUpdate({
                        _id: {
                            $eq: new ObjectId(req.body._id)
                        }
                    }, {
                        $set: {
                            password: hash
                        }
                    })
                    return res.status(200).json(u)
                } catch (error) {
                    console.log(error)
                    res.status(500).json({
                        error: true,
                        errorMessage: 'Internal server error'
                    })
                }
            })
    } catch (err) {
        return res.status(500).send({
            errorMessage: err
        })
    }
}

// POST ADD STATION
exports.addStation = async(req, res, next) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }
        let station = new Station({
                name: req.body.name
            })
            // check if email exists
        let s = await db.collection('stations').findOne({
            name: {
                $eq: station.name
            }
        })
        if (s) {
            return res.json({ // status needed --important--
                error: true,
                validationErrors: [{
                    param: 'name',
                    msg: 'A station with the same name already exists'
                }]
            })
        }
        try {
            station = await db.collection('stations').insertOne(station)
            station = station.ops[0]
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                error: true,
                errorMessage: err
            })
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'Station added successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

// POST ADD STATION
exports.addTripType = async(req, res, next) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }
        let tripType = new TripType({
                name: req.body.name,
                deck: req.body.deck,
                ticketPrice: req.body.ticketPrice,
                numberOfSeats: req.body.numberOfSeats
            })
            // check if name exists
        let t = await TripType.getAll(),
            errorMessage = ''
        t.forEach(type => {
            if (type.name === tripType.name) {
                if (type.deck === tripType.deck)
                    return errorMessage = 'A Trip Type with the same name and deck already exists'
                if ((tripType.deck === 'Upper' || tripType.deck === 'Lower') && type.deck === 'One level')
                    return errorMessage = 'A "One level" trip type already exists having this name'
                if (tripType.deck === 'One level' && (type.deck === 'Upper' || type.deck === 'Lower'))
                    return errorMessage = 'An "Upper" or a "Lower" trip type already exists having this name'
            }
        })
        if (errorMessage.length > 1) {
            return res.json({ // status needed --important--
                error: true,
                validationErrors: [{
                    param: 'name',
                    msg: errorMessage
                }]
            })
        }
        try {
            tripType = await db.collection('tripTypes').insertOne(tripType)
            tripType = tripType.ops[0]
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                error: true,
                errorMessage: err
            })
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'Trip Type added successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

exports.addTrip = async(req, res, next) => {
    db = getDb()
    const errors = validationResult(req)
    try {
        // validate req data
        if (!errors.isEmpty()) {
            return res.json({
                error: true,
                validationErrors: errors.array()
            })
        }
        let trip = new Trip({
            days: req.body.days,
            from: new ObjectId(req.body.from),
            to: new ObjectId(req.body.to),
            departureTime: Trip.regularTimeToMilitaryTime(req.body.departureTime),
            arrivalTime: Trip.regularTimeToMilitaryTime(req.body.arrivalTime),
            type: req.body.type
        })

        if (trip.departureTime === trip.arrivalTime) {
            return res.json({
                error: true,
                validationErrors: [{
                        param: 'departureTime',
                        msg: 'Can\'t have the same time for departure time and arrival time'
                    },
                    {
                        param: 'arrivalTime',
                        msg: 'Can\'t have the same time for departure time and arrival time'
                    }
                ]
            })
        }

        if (!Trip.timeIsValid(trip.departureTime, trip.arrivalTime)) {
            return res.json({
                error: true,
                validationErrors: [{
                        param: 'departureTime',
                        msg: 'Can\'t have more than 6 hours difference'
                    },
                    {
                        param: 'arrivalTime',
                        msg: 'Can\'t have more than 6 hours difference'
                    }
                ]
            })
        }
        let type = await TripType.findByName(trip.type)

        if (!type) {
            return res.json({ // ! status needed --important--
                error: true,
                validationErrors: [{
                    param: 'typeId',
                    msg: 'Invalid Type, refreshing the page may help ;)'
                }]
            })
        }
        // check if trip exists
        let t = await db.collection('trips').findOne({
                $and: [{
                        from: {
                            $eq: trip.from
                        }
                    },
                    {
                        to: {
                            $eq: trip.to
                        }
                    },
                    {
                        departureTime: {
                            $eq: trip.departureTime
                        }
                    },
                    {
                        arrivalTime: {
                            $eq: trip.arrivalTime
                        }
                    }
                ]
            })
            // ? merging 2 days arrays despite equality
        if (t) {
            t.days = mergeDates([t.days, trip.days])
            let u = await db.collection('trips').findOneAndUpdate({
                _id: {
                    $eq: new ObjectId(t._id)
                }
            }, {
                $set: {
                    days: t.days
                }
            })

        } else {
            try {
                trip = await db.collection('trips').insertOne(trip)
                trip = trip.ops[0]
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    error: true,
                    errorMessage: err
                })
            }
        }
        // response
        return res.status(200).json({
            error: false,
            message: 'Trip added successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: true,
            errorMessage: err
        })
    }
}

function mergeDates(...arrays) {
    let jointArray = []
    arrays.forEach(array => {
        jointArray = [...jointArray, ...array]
    })
    const uniqueArray = jointArray.filter((item, index) => jointArray.indexOf(item) === index)
    return uniqueArray[1]
}

exports.replyToFeedbacks = async(req, res, next) => {
    let data = req.body.data
    let response = sendmail(data.name, data.email, data.subject, data.message, data.oldMessage)
    await Feedback.addResponse(data.id, data.subject, data.message)
    res.json(response)
}

let sendmail = (name, email, subject, message, oldMessage) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bayroutetaxi@gmail.com',
            pass: '07727010'
        }
    })

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: '"BayRoute Taxi Support" <bayroutetaxi@gmail.com>', // sender address (who sends)
        to: email, // list of receivers (who receives)
        subject: subject, // Subject line
        // text: message, // plaintext body
        html: ` <blockquote>
                    <p>${oldMessage}</p>
                    <footer>—${name}, <cite>${email}</cite></footer>
                </blockquote>
                <p>${message}</p>` // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        return true
    })
}