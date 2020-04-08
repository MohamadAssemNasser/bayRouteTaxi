const express = require('express');
const controller = require('../controllers/website');
const router = express.Router();

router.get('/', controller.getHome)

router.get('/about-us', controller.getAboutUs)

router.get('/tickets-and-offers', controller.getTicketsAndOffers)

router.get('/destinations', controller.getDestinations)

router.get('/schedule', controller.getSchedule)

router.get('/contact-us', controller.getContactUs)

module.exports = router