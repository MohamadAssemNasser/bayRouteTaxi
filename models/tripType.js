const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class TripType {
    constructor(options) {
        if (options._id === undefined) options._id = null
        this._id = options._id
        this.name = options.name // Express or Standard
        this.level = options.level
        this.numberOfSeats = options.numberOfSeats
    }

    static async findById(id) {
        if (id === undefined) {
            throw 'Invalid ID for a trip type'
        }
        const db = getDb()
        try {
            let trip = await db.collection('tripType').findOne({
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
            let trips = await db.collection('tripType').find({})
            console.log(trips)
            return trips
        } catch (err) {
            console.log(err)
            return false
        }
    }

}

module.exports = TripType