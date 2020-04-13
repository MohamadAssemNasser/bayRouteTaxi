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
        this.type = options.type
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

    static timeToNumber(time) {
        return time.replace(':', '')
    }

    static numberToTime(number) {
        return [number.slice(0, 2), ':', number.slice(2)].join('')
    }

    static timeIsValid(from, to) {
        if (from.length > 4 || to.length > 4) {
            from = this.timeToNumber(from)
            to = this.timeToNumber(to)
            console.log(from, to)
        }
        if ((from >= 1800 && to <= 600 && (from - to < 1800)) || (to - from) > 600)
            return false
        return true
    }

    static militaryTimeToRegularTime(time) {
        time = this.timeToNumber(time)
        if (Math.floor(time / 100) == 24 || Math.floor(time / 100) == 0) {
            return `12:${time%10}${Math.floor((time%100)/10)} am`
        }
        if (Math.floor(time / 100) > 11) {
            time -= 1200
            if (time < 999)
                time = `0${time}`
            time = this.numberToTime(`${time}`)
            time += ' pm'
            return time
        }
        return `${this.numberToTime(time)} am`
    }

    static regularTimeToMilitaryTime(time) {
        let m = time.slice(6, 8)
        time = time.slice(0, 5)
        console.log(time)
        if (m == 'pm') {
            if (time.slice(0, 2) == 12) {
                return time
            }
            time = parseInt(this.timeToNumber(time))
            return this.numberToTime(`${time+=1200}`)
        }
        time = this.timeToNumber(time)
        if (m == 'am' && time >= 1200) {
            return `00:${time%10}${Math.floor((time%100)/10)}`
        }
        return this.numberToTime(time)
    }
}

module.exports = Trip