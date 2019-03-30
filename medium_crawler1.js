import request from 'request'
import fs from 'fs'
import cheerio from 'cheerio'
var async = require("async");

class MediumCrawler {

    constructor() {
        this.root = ''
        this.q = null
        this.links = []
        this.link = ''
        this.pageResult = 'test'
        this.ch = null
    }

    stripTrailingSlash(str) {
        if (str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }

    pageProcessor(htmlString) {

        this.ch = cheerio.load(htmlString);
        // Get only those links which point to same site
        this.ch(`a[href^="${this.root}"]`).each((i, a) => {
            // Ignore query params. Those point to same URL
            this.link = this.stripTrailingSlash(a.attribs.href.split('?')[0]);

            // Ignore URLs which are already there
            if (!this.links[this.link]) {
                this.links[this.link] = 'In Queue........';
                this.q.push(this.link);
                fs.appendFile('links.csv', this.link + "\n");
            }
        });
    }

    fetchAndParser(url) {
        return new Promise((resolve, reject) => {
            console.log(`fghjhgfhj`);
            request(url, (error, response, body) => {
                if (error) reject(error);
                console.log(`fghjhgfhj`);

                this.pageResult = this.pageProcessor(body)
                this.pageProcessor(body)
                this.links[url] = 'completed';
                console.log('completed', url);
                resolve(this.pageResult)
            });
        })
    }

    fetchAndParser(url) {
        console.log(`${this.pageProcessor("fghj")} ghj`);
    }

    requestHandler(url) {
        this.root = url
        this.q = async.queue(this.fetchAndParser,5)
        this.links[url] = 'In Queue........';
        fs.unlink('links.csv', () => this.q.push(this.stripTrailingSlash(this.root)));
    }
}

export default MediumCrawler