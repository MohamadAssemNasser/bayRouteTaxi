const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class Feedback {
    constructor(options) {
        if (options === undefined) options = {}
        if (options._id === undefined) options._id = null
        this._id = options._id
        this.name = options.name
        this.email = options.email
        this.option = options.option
        this.message = options.message
    }

    static async findBy(options) {
        if (options.id !== undefined) {
            const db = getDb()
            try {
                let u = await db.collection('feedbacks').findOne({ _id: new ObjectId(options.id) })
                return u
            } catch (err) {
                console.log(err)
            }
        } else {
            return 0;
        }
    }

    static async getAll() {
        const db = getDb()
        try {
            let feedbacks = await db.collection('feedbacks').find({})
            console.log(feedbacks)
            return feedbacks
        } catch (err) {
            console.log(err)
            return false
        }
    }

    static async addOne(f) {
        const db = getDb()
        try {
            let feedbacks = await db.collection('feedbacks').insertOne(f)
            console.log(feedbacks)
            return feedbacks
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

module.exports = Feedback