import request from 'request'
import fs from 'fs'
import cheerio from 'cheerio'
import create from './createData'
import update from './updateData'
import Queue from './queue'

var rootURL = ''
var que = null
var links = {}
var link = ''

/**
 * return a url without parameters 
 * @param {*} str
 * @returns
 */
const stripSlash = (str) => {    
    if (str.substr(-1) === '/') {       
        return str.substr(0, str.length - 1);
    }    
    return str;
}

/**
 * return all parameters key from url
 * @param {*} str
 * @returns
 */
const getParamsFromURL = (str) => {
    if(str){
        var queryDict = {}
        var param = []
        str.substr(0).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
        param = Object.keys(queryDict)
        return param
    }
}

/**
 * Perform scrapping on html body
 * return complete unique list of parameters associated with https;//medium.com
 * @param {*} body
 */
const htmlScrapper = (body) => {

    let ch = cheerio.load(body);

    // filter links only belongs medium.com
    ch(`a[href^="${rootURL}"]`).each((i, a) => {
        let params = []
        // get all parameter associated with a url
        params = getParamsFromURL(a.attribs.href.split('?')[1])
        //get url associated with https;//medium.com
        link = stripSlash(a.attribs.href.split('?')[0])
        
        // check url is unique or not. If unique perform further action.
        if (!links[link]) {
            links[link] = {};
            links[link]['status'] = 'false'; 
            links[link]['count'] = 1;
            links[link]['params'] = ['']

            if(!params){
                links[link]['params'] = ['']
            }
            else if(params){
                links[link]['params'] = params;
            }            

            que.push(link);
            try{
                // create objects in db
                create(link, links[link]['count'], links[link]['params'])
            }catch(e){
                //update objects value
                update(link, links[link]['count'], links[link]['params'])
            }
        }else {
            //check parameters associated with a url is undefiend or not
            if(!links[link]['params']){
                links[link]['params'] = ['']
            }
            //increase total reference count for repeated urls
            links[link]['count'] += 1;        
            
            //check new params array is empty or not
            if(params && params.length > 0){
                let joinArray = links[link]['params'].concat(params);
                links[link]['params'] = [... new Set( joinArray)];  
            }
            // update object valeus
            update(link, links[link]['count'], links[link]['params'])
        }        
    }); 
}

/**
 * request handler
 * @param {*} url
 * @param {*} callback
 */
const fetchAndParser = (url, callback) => {
    return new Promise((resolve, reject) => {
        console.log(typeof(callback))
        request(url, (error, response, body) => {
            if (error) {
                console.log("Network Error", error);
                reject(error);
            } else {
                htmlScrapper(body);
                links[url] = {};
                links[url]['status'] = 'true';
                links[url]['count'] = 1; 
                resolve(url);
            }
        });
    })
}

/**
 * 
 * maintain concurrency requests
 * @param {*} url
 */
export const requestHandler = (url, reqCount) => {
    rootURL = url
    //create queue
    que = new Queue(fetchAndParser, reqCount)
    fs.unlink('url.csv', () => que.push(stripSlash(rootURL)));
}