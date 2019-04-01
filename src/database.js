import mongoose from 'mongoose'
import ifDocker from '../confg/isDocker'
var server = 'localhost:27017'; // db server
const database = 'Medium'; // db name

/**
 *
 *
 * @class Database
 */
class Database {
  constructor() {
    this._connect()
  }

  /**
   *
   *
   * @memberof Database
   */
  _connect() {
    // check service is running on docker or not
    if(ifDocker()){
      server = 'mongo:27017'
      console.log(true);
    }
    // connect to mongodb server
    mongoose.connect(`mongodb://${server}/${database}`, {
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
      })
      .then(() => {
        // on success
        console.log('Database connection successful')
      })
      .catch(err => {
        // on failure
        console.error('Database connection error')
      })
  }
}

export default new Database()