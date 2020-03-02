const getDb = require('../util/database').getDb;

class Trip {
    constructor(options) {
        this._id = options._id
        this.from = options.from
        this.to = options.to
        this.departureTime = options.departureTime
        this.arrivalTime = options.arrivalTime
        this.type = options.type
    }
}

module.exports = Trip