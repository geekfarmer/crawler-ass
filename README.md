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

### Current

![Current Requests Processing](/assets/current.png)

### Before

![Current Requests Processing](/assets/before.png)

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



