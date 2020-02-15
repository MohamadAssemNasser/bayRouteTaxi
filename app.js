const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const subdomain = require('express-subdomain')

const mongoConnect = require('./util/database').mongoConnect;

const app = express()

// view engines
app.set('view engine', 'ejs');
app.set('views', 'views');

// routers
const websiteRoutes = require('./routes/website')
const apiRoutes = require('./routes/api')
const adminRoutes = require('./routes/admin')

// helpers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// api router
app.use(subdomain('api', apiRoutes))

// admin router
//app.use(subdomain('admin', adminRoutes))
app.use(adminRoutes)

// standard router
app.use(websiteRoutes)

// default router
app.get('/', function (req, res) {
    res.send('Hello World')
})

mongoConnect(() => app.listen(3000))