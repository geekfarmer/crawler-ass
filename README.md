# crawler-ass

```shell
>> node --version
v11.10.1

ECMA script version - es6
```
### How to start

* Clone the project using git clone https://github.com/geekfarmer/crawler-medium

* Navigate to the folder and follow the instructions.

```javascript
// database connection
>> npm install

>> mongod

>> node -r esm index.js
// or
>> npm start
```
### Concurrency Queue Test

* To check the concurrency queue test, run the follow code.

```javascript
import Queue from './src/services/queue'
function async(data) {
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("resolving", data);
            resolve(data);
        }, Math.random() * 5000);
    });
}

var queue = new Queue(async);

Promise.all(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50].map(queue.push.bind(queue))
).then((result) => {
    console.log(result); 
});

```
### Docker

* start docker-compose
```
sudo docker-compose up --build
```

### Database - MongoDB
```javascript
server: 127.0.0.1:27017
dbName: Medium
```

### Parsed data from medium.com

- [x] link - url
- [x] total reference - count
- [x] associtated parameter = param

### Needed 

- [x] asynchornous in nature
- [x] maintain concurrency of 5 request at a time, should not blocked
- [x] requestjs no need to use connectionpool
- [x] not allowed to use external scrapping and async tool
- [x] Refrain from using throttled-request package to limit concurrency



