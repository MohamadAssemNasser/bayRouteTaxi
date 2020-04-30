const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class User {
    constructor(options) {
        if (options === undefined) options = {}
        if (options.token === undefined) options.token = null
        if (options.tickets === undefined) options.tickets = []
        if (options._id === undefined) options._id = null
        if (options.phone === undefined) options.phone = null
        if (options.paymentMethods === undefined) options.paymentMethods = []
        this.name = options.name
        this.password = options.password
        this.email = options.email
        this.phone = options.phone
        this.token = options.token
        this.tickets = options.tickets
        this.paymentMethods = options.paymentMethods
        this._id = options._id
    }

    static async findBy(options) {

        if (options.id !== undefined) {
            const db = getDb()
            try {
                let u = await db.collection('users').findOne({ _id: new ObjectId(options.id) })
                return u
            } catch (err) {
                console.log(err)
            }
        }
        if (options.email !== undefined) {
            const db = getDb()
            try {
                let u = await db.collection('users').findOne({ email: options.email })
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
            let users = await db.collection('users').find({})
            console.log(users)
            return users
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

module.exports = User