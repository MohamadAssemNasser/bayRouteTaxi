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


// -------------- GET --------------
router.get('/', auth.proceedIfLoggedIn, controller.getDashboard)

router.get('/login', auth.preventIfLoggedIn, controller.getLogin)

router.get('/users', auth.proceedIfLoggedIn, auth.isAdmin, controller.getUsers)

router.get('/trips', auth.proceedIfLoggedIn, controller.getTrips)

router.get('/stations', auth.proceedIfLoggedIn, auth.isAdmin, controller.getStations)

router.get('/tripTypes', auth.proceedIfLoggedIn, auth.isAdmin, controller.getTripTypes)

// -------------- POST --------------
router.post('/logout', auth.proceedIfLoggedIn, controller.postLogout)

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
// ------- POST -------

router.post('/site/add-panel-user',
    addPanelUserValidation,
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.addPanelUser
)

router.post('/site/add-station',
    [
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


// ------- PUT -------

router.put('/site/update-panel-user',
    updatePanelUserValidation,
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.updatePanelUser
)

router.put('/site/reset-password',
    auth.proceedIfLoggedIn,
    auth.isAdmin,
    controller.resetPanelUserPassword
)

router.put('/site/update-station',
    [
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

router.get('*', (req, res) => res.redirect('/'))

module.exports = router