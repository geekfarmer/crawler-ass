var PromisePool = require('es6-promise-pool')

var maxParallelRequests = 3;
var count = 0;
var total = 100;

const generatePromises = function* () {
    if (count < total) {
        count++;
    } else {
        return null;
    }
}

const promiseIterator = generatePromises()
const pool = new PromisePool(promiseIterator, maxParallelRequests)

pool.start()
    .then(() => console.log('Complete'))