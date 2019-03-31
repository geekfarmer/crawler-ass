# crawler-ass

```shell
>> node --version
v11.10.1

ECMA script version - es6
```
## how to start

```javascript
// database connection
>> npm install

>> mongod

>> node -r esm index.js
// or
>> npm start

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



