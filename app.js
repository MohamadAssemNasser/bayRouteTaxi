const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const subdomain = require('express-subdomain')

const mongoConnect = require('./util/database').mongoConnect;

const app = express()

// view enginesa
app.set('view engine', 'ejs');
app.set('views', 'views');

// routers
const websiteRoutes = require('./routers/website')
const apiRoutes = require('./routers/api')

// helpers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// api router
app.use(subdomain('api', apiRoutes))

// standard router
app.use(websiteRoutes)

// default router
app.get('/', function(req, res) {
    res.send('Hello World')
})

mongoConnect(() => app.listen(3000))