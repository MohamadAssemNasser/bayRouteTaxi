const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class Station {
    constructor(options) {
        if (options._id === undefined) options._id = null
        this._id = options._id
        this.name = options.name
    }

    static async findById(id) {
        if (id === undefined) {
            throw 'Invalid ID for a trip'
        }
        const db = getDb()
        try {
            let station = await db.collection('stations').findOne({
                _id: new ObjectId(options.id)
            })
            return station
        } catch (err) {
            console.log(err)
        }
    }

    static async getAll() {
        const db = getDb()
        try {
            let stations = await db.collection('stations').find({})
            return stations.toArray()
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Station