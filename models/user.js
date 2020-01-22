const getDb = require('../util/database').getDb;

class User {
    constructor(options) {
        if (options === undefined) options = {}
        if (options.token === undefined) options.token = null
        if (options.tripsCount === undefined) options.tripsCount = 0
        if (options.points === undefined) options.points = 0
        if (options.tickets === undefined) options.tickets = []
        if (options._id === undefined) options._id = null
        this.name = options.name
        this.password = options.password
        this.email = options.email
        this.token = options.token
        this.tripsCount = options.tripsCount
        this.points = options.points
        this.tickets = options.tickets
        this._id = options._id;
    }

    static async findById(id) {
        const db = getDb();
        try {
            let u = await db.collection('users').findOne({ _id: new ObjectId(id) })
            return u;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = User