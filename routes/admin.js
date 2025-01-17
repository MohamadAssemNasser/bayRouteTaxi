const express = require('express')
const {
    body
} = require('express-validator');

const controller = require('../controllers/admin')
const auth = require('../middlewares/auth')

const router = express.Router();

let addPanelUserValidation = [
    body('firstName')
    .trim()
    .isLength({
        min: 2,
    })
    .isAlpha(),
    body('lastName')
    .trim()
    .isLength({
        min: 2,
    })
    .isAlpha(),
    body('phone', 'Invalid phone number')
    .blacklist(' ')
    .isLength({
        min: 8,
    })
    .withMessage('Should be at least 8 digits')
    .isNumeric()
    .withMessage('Should be numeric only'),
    body('email', 'Invalid email address')
    .trim()
    .isLength({
        min: 7,
    })
    .isEmail(),
    body('password', 'length must at least be 8')
    .trim()
    .isLength({
        min: 8, // change to 8 -- important --
    }),
    body('role', 'Invalid Role')
    .custom((value, {
        req
    }) => (value === 'Check In' || value === 'Data Entry'))
]

let updatePanelUserValidation = [
    body('firstName')
    .trim()
    .isLength({
        min: 2,
    }),
    body('lastName')
    .trim()
    .isLength({
        min: 2,
    }),
    body('phone', 'Invalid phone number')
    .blacklist(' ')
    .isLength({
        min: 8,
    })
    .isNumeric(),
    body('email', 'Invalid email address')
    .trim()
    .isLength({
        min: 7,
    })
    .isEmail(),
    body('role', 'Invalid Role')
    .custom((value, {
        req
    }) => (value === 'Check In' || value === 'Data Entry'))
]

let updateProfileValidation = [
    body('firstName')
    .trim()
    .isLength({
        min: 2,
    }),
    body('lastName')
    .trim()
    .isLength({
        min: 2,
    }),
    body('phone', 'Invalid phone number')
    .blacklist(' ')
    .isLength({
        min: 8,
    })
    .isNumeric(),
    body('email', 'Invalid email address')
    .trim()
    .isLength({
        min: 7,
    })
    .isEmail()
]

// -------------- GET --------------

router.get('/', auth.proceedIfLoggedIn, controller.redirectToProfile)

router.get('/login', auth.preventIfLoggedIn, controller.getLogin)

router.get('/trips', auth.proceedIfLoggedIn, controller.getTrips)

router.get('/stations', auth.proceedIfLoggedIn, auth.isAdmin, controller.getStations)

router.get('/tripTypes', auth.proceedIfLoggedIn, auth.isAdmin, controller.getTripTypes)

router.get('/users', auth.proceedIfLoggedIn, auth.isAdmin, controller.getUsers)

router.get('/logout', auth.proceedIfLoggedIn, controller.getLogout)

router.get('/profile', auth.proceedIfLoggedIn, controller.getProfile)

router.get('/feedbacks', auth.proceedIfLoggedIn, controller.getFeedbacks)

router.get('/issues', auth.proceedIfLoggedIn, controller.getIssues)

router.get('/business-purposes', auth.proceedIfLoggedIn, controller.getBusinessPurposes)

router.get('/feature-requests', auth.proceedIfLoggedIn, controller.getFeatureRequests)

// -------------- POST --------------

router.post('/login', [
    body('email')
    .isLength({
        min: 7,
    })
    .trim()
    .isEmail(),
    body('password')
    .isLength({
        min: 3, // change to 8 -- important --
    })
    .trim()
], controller.postLogin)

// -------------- ADMIN APIs --------------


// ------- GET -------

router.get('/site/all-panel-users',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getAllPanelUsers
)

router.get('/site/panel-user/:userId',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getPanelUser
)

router.get('/site/all-stations',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getAllStations
)

router.get('/site/station/:stationId',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getStation
)

router.get('/site/all-tripTypes',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getAllTripTypes
)

router.get('/site/tripType/:tripTypeId',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.getTripType
)

router.get('/site/trips',
    auth.proceedIfLoggedIn,
    controller.getAllTrips
)

router.get('/site/feedbacks/:option',
    auth.proceedIfLoggedIn,
    controller.getFeedbacksApi
)

// ------- POST -------

router.post('/site/add-panel-user',
    addPanelUserValidation,
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.addPanelUser
)

router.post('/site/add-station', [
        body('name')
        .trim()
        .isLength({
            min: 3
        })
    ],
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.addStation
)

router.post('/site/add-tripType', [
        body('name')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage('Minimum 3 characters'),
        body('deck')
        .trim()
        .custom((value) => (value === 'Upper' || value === 'Lower' || value === 'One level')),
        body('ticketPrice')
        .blacklist(' ')
        .blacklist('LBP')
        .blacklist(',')
        .isNumeric()
        .withMessage('The value is not numeric'),
        body('numberOfSeats')
        .isNumeric()
        .withMessage('The value is not numeric')
    ],
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.addTripType
)

router.post('/site/add-trip', [
        body('from')
        .custom((value, { req }) => {
            return (value !== req.body.to)
        })
        .withMessage("Can't have the same station as a departure and arrival station"),
        body('days')
        .custom((value, { req }) => {
            return (value.length > 0)
        })
        .withMessage("Choose at least one day"),
        body('departureTime')
        .trim()
        .custom((value, { req }) => {
            return (value.length > 0)
        })
        .withMessage("Choose a valid Time"),
        body('arrivalTime')
        .trim()
        .custom((value, { req }) => {
            return (value.length > 0)
        })
        .withMessage("Choose a valid Time")
    ],
    auth.proceedIfLoggedIn,
    controller.addTrip
)

router.post('/site/reply', auth.proceedIfLoggedIn, controller.replyToFeedbacks)

// ------- PUT -------

router.put('/site/update-panel-user/:userId',
    updateProfileValidation,
    auth.proceedIfLoggedIn,
    controller.updateProfile
)

router.put('/site/update-panel-user',
    updatePanelUserValidation,
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.updatePanelUser
)

router.put('/site/reset-password/:userId',
    auth.proceedIfLoggedIn, [
        body('password')
        .trim()
        .isLength({
            min: 7
        })
        .withMessage('Password should at least have 7 characters'),
        body('confirmPassword', 'Passwords mut match')
        .custom((value, {
            req
        }) => (value === req.body.password))
    ],
    controller.updatePanelUserPassword
)

router.put('/site/reset-password',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.resetPanelUserPassword
)

router.put('/site/update-station', [
        body('name')
        .trim()
        .isLength({
            min: 3
        })
    ],
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.updateStation
)
router.put('/site/update-tripType', [
        body('name')
        .trim()
        .isLength({
            min: 3
        })
        .withMessage('Minimum 3 characters'),
        body('deck')
        .trim()
        .custom((value) => (value === 'Upper' || value === 'Lower' || value === 'One level')),
        body('ticketPrice')
        .blacklist(' ')
        .blacklist('LBP')
        .blacklist(',')
        .isNumeric()
        .withMessage('The value is not numeric'),
        body('numberOfSeats')
        .isNumeric()
        .withMessage('The value is not numeric')
    ],
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.updateTripType
)

// ------- DELETE -------

router.delete('/site/delete-panel-user',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.deletePanelUser
)

router.delete('/site/delete-station',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.deleteStation
)

router.delete('/site/delete-tripType',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.deleteTripType
)

router.get('*', (req, res) => res.redirect('/'))

module.exports = router