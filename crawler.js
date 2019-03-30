var https = require('https');

// check if user supplied an URL or not
if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " URL");
    process.exit(-1);
}

var url = process.argv[2]

// provide requested url and callback
https.get(url, function (res) {
    if(res.statusCode === 200){
        var content = '';
        res.on('data', function (chunk) {
            console.log('chunk ' + chunk.length);
            content += chunk;
        });
        res.on('end', function () {
            console.log('end');
            console.log(content.length);
            console.log(content);
        });
    }
    else console.log("Got error: " + res.statusCode);
}).on('error', function (e) {
    console.log("Got error: " + e.message);
});