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
        this.responded = false
        let date_ob = new Date();
        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2)
            // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
            // current year
        let year = date_ob.getFullYear()
            // current hours
        let hours = date_ob.getHours()
        hours = hours < 10 ? `0${hours}` : hours
            // current minutes
        let minutes = date_ob.getMinutes()
        minutes = minutes < 10 ? `0${minutes}` : minutes
            // current seconds
        let seconds = date_ob.getSeconds()
        seconds = seconds < 10 ? `0${seconds}` : seconds
            // prints date & time in YYYY-MM-DD HH:MM:SS format
        this.date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    }

    static async addResponse(id, subject, message) {
        const db = getDb()
        try {
            let u = await db.collection('feedbacks').findOneAndUpdate({
                _id: {
                    $eq: new ObjectId(id)
                }
            }, {
                $set: {
                    reponse: {
                        subject: subject,
                        message: message
                    },
                    responded: true
                }
            })
            return u
        } catch (err) {
            console.log(err)
        }
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

    static async getAll(option) {
        const db = getDb()
        try {
            let feedbacks = await db.collection('feedbacks').find({
                $and: [{
                        option: option
                    },
                    {
                        responded: false
                    }
                ]
            })
            return feedbacks.toArray()
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