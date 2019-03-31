import mongoose from 'mongoose'
const server = 'mongo:27017'; // db server
const database = 'Medium'; // db name

class Database {
  constructor() {
    this._connect()
  }
  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`, {
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
      })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error')
      })
  }
}

export default new Database()