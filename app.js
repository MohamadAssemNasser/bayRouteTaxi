const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs');
app.set('views', 'views');

const websiteRoutes = require('./routers/website')
const apiRoutes = require('./routers/api')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(websiteRoutes)
app.use(apiRoutes)

app.get('/', function(req, res) {
        res.send('Hello World')
    }) //hello


mongoConnect(() => app.listen(3000))