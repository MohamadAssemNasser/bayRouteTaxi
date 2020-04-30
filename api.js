const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const subdomain = require('express-subdomain')
const mongoConnect = require('./util/database').mongoConnect


const app = express()

// view engines
// app.set('view engine', 'ejs')
// app.set('views', 'views')

// static folders
// app.use(express.static(path.join(__dirname, 'public')))

// routers
const apiRoutes = require('./routes/api')

// helpers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

// api router
console.log('API IS RUNNING')
    // app.use(subdomain('api', apiRoutes))
app.use('/api', apiRoutes)

mongoConnect(() => app.listen(80))

// mongoConnect(() => app.listen(3001, '172.31.0.89'))