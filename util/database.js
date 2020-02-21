const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
require('dotenv').config()

let _db

const mongoConnect = async(callback) => {
    try {
        const client = await MongoClient.connect(process.env.DB_URI, {useUnifiedTopology: true})
        console.log(`-----   Connected to Database.   -----`)
        _db = client.db()
        callback()
    } catch (err) {
        console.log(err)
        throw err
    }
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb