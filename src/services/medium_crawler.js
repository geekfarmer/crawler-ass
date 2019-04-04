import request from "request";
import cheerio from "cheerio";
import rp from "request-promise";
import create from "./createData";
import update from "./updateData";
import Queue from "./queue";
import PromisePool from 'es6-promise-pool'

var rootURL = "";
var que = null;
var links = {};
var link = "";
var totalRequests = 0;
// var totalLinks = 0;

/**
 * return a url without parameters
 * @param {*} str
 * @returns
 */

const config = {
    MAX_REQ: 20,
    CON_REQ: 5
};

const stripSlash = str => {
    if (str.substr(-1) === "/") {
        return str.substr(0, str.length - 1);
    }
    return str;
};

/**
 * return all parameters key from url
 * @param {*} str
 * @returns
 */
const getParamsFromURL = str => {
    if (str) {
        var queryDict = {};
        var param = [];
        str
            .substr(0)
            .split("&")
            .forEach(function (item) {
                queryDict[item.split("=")[0]] = item.split("=")[1];
            });
        param = Object.keys(queryDict);
        return param;
    }
};

/**
 * Perform scrapping on html body
 * return complete unique list of parameters associated with https;//medium.com
 * @param {*} body
 */
const htmlScrapper = body => {
    return new Promise((resolve, reject) => {
        let ch = cheerio.load(body);

        // filter links only belongs medium.com
        ch(`a[href^="${rootURL}"]`).each((i, a) => {
            let params = [];
            // get all parameter associated with a url
            params = getParamsFromURL(a.attribs.href.split("?")[1]);
            //get url associated with https;//medium.com
            link = stripSlash(a.attribs.href.split("?")[0]);

            // check url is unique or not. If unique perform further action.
            if (!links[link]) {
                que.totalLinks++;
                links[link] = {};
                links[link]["status"] = "false";
                links[link]["count"] = 1;
                links[link]["params"] = [""];

                if (!params) {
                    links[link]["params"] = [""];
                } else if (params) {
                    links[link]["params"] = params;
                }
                que.push(link);
                resolve(link)
                try {
                    // create objects in db
                    create(link, links[link]["count"], links[link]["params"]);
                } catch (e) {
                    //update objects value
                    update(link, links[link]["count"], links[link]["params"]);
                }
            } else {
                //check parameters associated with a url is undefiend or not
                if (!links[link]["params"]) {
                    links[link]["params"] = [""];
                }
                //increase total reference count for repeated urls
                links[link]["count"] += 1;

                //check new params array is empty or not
                if (params && params.length > 0) {
                    let joinArray = links[link]["params"].concat(params);
                    links[link]["params"] = [...new Set(joinArray)];
                }
                // update object valeus
                update(link, links[link]["count"], links[link]["params"]);
            }
        });
    })

};

/**
 * request handler
 * @param {*} url
 */

 let testHit = 0;

const fetchAndParser = async (url) => {
    if (totalRequests < config.MAX_REQ) {
        return await rp(url, (error, response, body) => {
            console.log("Request Count", totalRequests);
            if (error) console.log("Network Error", error);
            totalRequests++;
            console.log("crawling......", url);
            que.dequeue();
            htmlScrapper(body).then((link) => {
                    return link;
                })
                .catch((err) => {
                    return err;
                })
            que.dequeue(link)
            links[url] = {};
            links[url]["status"] = "true";
            links[url]["count"] = 1;
        });
    }
    else {
        que.StopCrawler()
        return null;
    }
};

/**
 *
 * maintain concurrency requests
 * @param {*} url
 */
export const requestHandler = url => {
    rootURL = url;

    //create queue
    que = new Queue(fetchAndParser, config.CON_REQ);
    que.push(stripSlash(rootURL));
};