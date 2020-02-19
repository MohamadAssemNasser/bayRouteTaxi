const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const subdomain = require('express-subdomain')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const mongoConnect = require('./util/database').mongoConnect

const app = express()

const store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: 'sessions'
})

// view engines
app.set('view engine', 'ejs');
app.set('views', 'views');

// static folders
app.use(express.static(path.join(__dirname, 'public')))

// routers
const websiteRoutes = require('./routes/website')
const apiRoutes = require('./routes/api')
const adminRoutes = require('./routes/admin')

// helpers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(
    session({
        secret: 'AieAFIEavna',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)

app.use(csrf())
app.use(flash())

app.use((req, res, next) => {
    // throw new Error('Sync Dummy')
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user
            next()
        })
        .catch(err => {
            next(new Error(err))
        })
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

// api router
//app.use(subdomain('api', apiRoutes))
app.use('/api', apiRoutes)

// admin router
//app.use(subdomain('admin', adminRoutes))
app.use(adminRoutes)

// standard router
//app.use(websiteRoutes)


// Error router
app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...)
    // res.redirect('/500')
    console.log(error)
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
})

mongoConnect(() => app.listen(3000))