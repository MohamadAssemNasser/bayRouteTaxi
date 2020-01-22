const getDb = require('../util/database').getDb;

class Ticket {
    constructor(options) {
        if (options === undefined) options = {}
        if (options._id === undefined) options._id = null
        if (options.from === undefined) options.from = null
        if (options.to === undefined) options.to = null
        if (options.type === undefined) options.type = null
        if (options.deck === undefined) options.deck = null
        if (options.ticketPrice === undefined) options.ticketPrice = 0
        if (options.capacity === undefined) options.capacity = 0
        this._id = options._id;
        this.from = options.from
        this.to = options.to
        this.type = options.type
        this.deck = options.deck
        this.ticketPrice = options.ticketPrice
        this.capacity = options.capacity
    }

    static async findById(id) {
        const db = getDb();
        try {
            let u = await db.collection('tickets').findOne({ _id: new ObjectId(id) })
            return u;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = User