const getDb = require('../util/database').getDb;

class Trip {
    constructor(options) {
        if (options._id === undefined) options._id = null
        this._id = options._id
        this.days = options.days
        this.from = options.from
        this.to = options.to
        this.departureTime = options.departureTime
        this.arrivalTime = options.arrivalTime
        this.typeId = options.typeId
    }

    static async findById(id) {
        if (id === undefined) {
            throw 'Invalid ID for a trip'
        }
        const db = getDb()
        try {
            let trip = await db.collection('trips').findOne({
                _id: new ObjectId(options.id)
            })
            return trip
        } catch (err) {
            console.log(err)
            return false
        }
    }

    static async getAll() {
        const db = getDb()
        try {
            let trips = await db.collection('trips').find({})
            console.log(trips)
            return trips.toArray()
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

module.exports = Trip