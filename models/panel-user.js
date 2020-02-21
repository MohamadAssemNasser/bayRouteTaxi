const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class User {
    constructor(options) {
        if (options === undefined) options = {}
        if (options.token === undefined) options.token = null
        if (options.phone === undefined) options.phone = null
        if (options._id === undefined) options._id = null
        this.firstName = options.firstName
        this.lastName = options.lastName
        this.password = options.password
        this.email = options.email
        this.phone = options.phone
        this.role = options.role
        this.token = options.token
        this._id = options._id
    }

    static async findBy(options) {

        if (options.id !== undefined) {
            const db = getDb()
            try {
                let u = await db.collection('panel-users').findOne({
                    _id: new ObjectId(options.id)
                })
                return u
            } catch (err) {
                console.log(err)
            }
        }
        if (options.email !== undefined) {
            const db = getDb()
            try {
                let u = await db.collection('panel-users').findOne({
                    email: options.email
                })
                return u
            } catch (err) {
                console.log(err)
            }
        }
        return Error('undefined option', options);
    }
}

module.exports = User