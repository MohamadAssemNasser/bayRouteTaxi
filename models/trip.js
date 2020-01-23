const getDb = require('../util/database').getDb;

class Trip {
    constructor(options) {
        if (options === undefined) options = {}
        if (options._id === undefined) options._id = null
        if (options.from === undefined) options.from = null
        if (options.to === undefined) options.to = null
        if (options.departureTime === undefined) options.departureTime = null
        if (options.arrivalTime === undefined) options.arrivalTime = null
        if (options.class === undefined) options.class = null
        if (options.deck === undefined) options.deck = null
        if (options.ticketPrice === undefined) options.ticketPrice = 0
        if (options.capacity === undefined) options.capacity = 0
        if (options.availableSeats === undefined) options.availableSeats = 0
        if (options.passengers === undefined) options.passengers = []
        this._id = options._id;
        this.from = options.from
        this.to = options.to
        this.departureTime = options.departureTime
        this.arrivalTime = options.arrivalTime
        this.class = options.class
        this.deck = options.deck
        this.ticketPrice = options.ticketPrice
        this.capacity = options.capacity
        this.availableSeats = options.availableSeats
        this.passengers = options.passengers
    }

    static async findById(id) {
        const db = getDb();
        try {
            let u = await db.collection('trips').findOne({ _id: new ObjectId(id) })
            return u;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = User