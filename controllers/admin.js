const mongodb = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  validationResult
} = require('express-validator')

const User = require('../models/panel-user')
const Station = require('../models/station')
const TripType = require('../models/tripType')

const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

let db

// POST LOGOUT
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

// GET LOGIN
exports.getLogin = async (req, res, next) => {
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
exports.postLogin = async (req, res, next) => {
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

// GET DASHBOARD '/'
exports.getDashboard = async (req, res, next) => {
  return res.render('admin/dashboard', {
    pageTitle: 'BayRoute Taxi :: Dashboard',
    path: '/',
    user: {
      firstName: req.user.firstName,
      role: req.user.role,
    }
  })
}

// GET TRIPS
exports.getTrips = async (req, res, next) => {
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
exports.getUsers = async (req, res, next) => {
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
exports.getStations = async (req, res, next) => {
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
exports.getTripTypes = async (req, res, next) => {
  return res.render('admin/tripTypes', {
    pageTitle: 'BayRoute Taxi :: Trip Types',
    path: '/tripTypes',
    user: {
      firstName: req.user.firstName,
      role: req.user.role
    }
  })
}

// ------------- APIs -------------

// GET ALL USERS
exports.getAllPanelUsers = async (req, res, next) => {
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
exports.getPanelUser = async (req, res, next) => {
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
exports.getAllStations = async (req, res, next) => {
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

exports.getAllTripTypes = async (req, res, next) => {
  db = getDb()
  try {
    let tripTypes = await TripType.getAll()
    console.log(tripTypes)
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
exports.getStation = async (req, res, next) => {
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

exports.getTripType = async (req, res, next) => {
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

// POST REGISTER USERS
exports.addPanelUser = async (req, res) => {
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
      async (err, hash) => {
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

exports.deletePanelUser = async (req, res, next) => {
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

exports.deleteStation = async (req, res, next) => {
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

exports.deleteTripType = async (req, res, next) => {
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

exports.updatePanelUser = async (req, res, next) => {
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
    console.log(u)
    console.log(req.body._id)
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

exports.updateStation = async (req, res, next) => {
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

exports.updateTripType = async (req, res, next) => {
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

exports.resetPanelUserPassword = async (req, res, next) => {
  db = getDb()
  try {
    // password hashing
    bcrypt.hash('12345678', 12,
      async (err, hash) => {
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
exports.addStation = async (req, res, next) => {
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
exports.addTripType = async (req, res, next) => {
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
    let t = await TripType.getAll(), errorMessage = ''
    t.forEach(type => {
      if(type.name === tripType.name){
        if(type.deck === tripType.deck)
        return errorMessage = 'A Trip Type with the same name and deck already exists'
      if((tripType.deck === 'Upper' || tripType.deck === 'Lower') && type.deck === 'One level')
        return errorMessage = 'A "One level" trip type already exists having this name'
      if(tripType.deck === 'One level' && (type.deck === 'Upper' || type.deck === 'Lower'))
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

exports.addTrip = async (req, res, next) => {
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
    from: req.body.from,
    to: req.body.to,
    departureTime: req.body.departureTime,
    arrivalTime: req.body.arrivalTime,
    typeId: req.body.typeId
  })
  // check if trip exists
  let t = db.collection('trips').findOne({
    $and: [
      {
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

  if(t){

  }
  
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