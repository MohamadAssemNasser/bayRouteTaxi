const getDb = require('../util/database').getDb;

class Trip {
    constructor(options) {
        if (options === undefined) options = {}
        if (options._id === undefined) options._id = null
        if (options.from === undefined) options.from = null
        if (options.to === undefined) options.to = null
        if (options.departureTime === undefined) options.departureTime = null
        if (options.arrivalTime === undefined) options.arrivalTime = null
        if(options.type === undefined) options.type = null
        this._id = options._id
        this.from = options.from
        this.to = options.to
        this.departureTime = options.departureTime
        this.arrivalTime = options.arrivalTime
        this.type = options.type
    }
}

module.exports = Trip