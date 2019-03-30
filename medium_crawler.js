import request from 'request'
import fs from 'fs'
import cheerio from 'cheerio'
import async from 'async'

var root = ''
var q = null
var links = []
var link = ''

const stripTrailingSlash = (str) => {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

const pageProcessor = (htmlString) => {

    let ch = cheerio.load(htmlString);
    // Get only those links which point to same site
    ch(`a[href^="${root}"]`).each((i, a) => {
        // Ignore query params. Those point to same URL
        link = stripTrailingSlash(a.attribs.href.split('?')[0]);

        // Ignore URLs which are already there
        if (!links[link]) {
            links[link] = 'In Queue........';
            q.push(link);
            fs.appendFile('url.csv', link + "\n", function (err, result) {
                if (err) console.log('error', err);
            });
        }
    });
}

export const fetchAndParser = (url, callback) => {
    console.log(`started ${url}`);
    request(url, (error, response, body) => {
        console.log("..................");
        if (error) {
            console.log("Network Error", error);
            callback(error, url);
        } else {
            pageProcessor(body);
            links[url] = 'completed';
            console.log('completed', url);
            callback(error, url);
        }
    });
}

export const requestHandler = (url) => {
    root = url
    q = async.queue(fetchAndParser, 5)
    links[url] = 'In Queue........';
    fs.unlink('url.csv', () => q.push(stripTrailingSlash(root)));
}