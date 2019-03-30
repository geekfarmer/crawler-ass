import request from 'request'
import fs from 'fs'
import cheerio from 'cheerio'
import async from 'async'
import json2csv from 'json2csv'

var root = ''
var q = null
var links = {}
var link = ''

const stripTrailingSlash = (str) => {    
    if (str.substr(-1) === '/') {       
        return str.substr(0, str.length - 1);
    }    
    return str;
}

const getParamsFromURL = (str) => {
    if(str){
        var queryDict = {}
        var param = []
        str.substr(0).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
        param = Object.keys(queryDict)
        return param
    }
}

const pageProcessor = (htmlString) => {

    let ch = cheerio.load(htmlString);
    // filter links only belongs medium.com
    ch(`a[href^="${root}"]`).each((i, a) => {
        // Ignore query params. Those point to same URL
        let params = []
        params = getParamsFromURL(a.attribs.href.split('?')[1])
        link = stripTrailingSlash(a.attribs.href.split('?')[0])
        
        // Ignore URLs which are already there
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
                    
            q.push(link);
            fs.appendFile('url.csv', link + "\n", function (err, result) {
                if (err) console.log('error', err);
            });
        }else {
            // increase count value for repeated url;
            if(!links[link]['params']){
                links[link]['params'] = ['']
            }
            links[link]['count'] += 1;             
            if(params && params.length > 0){
                let joinArray = links[link]['params'].concat(params);
                links[link]['params'] = [... new Set( joinArray)];  
            }
        }        
    });
    console.log(Object.values(links));
    
}

const fetchAndParser = (url, callback) => {
    request(url, (error, response, body) => {
        if (error) {
            console.log("Network Error", error);
            callback(error, url);
        } else {
            pageProcessor(body);
            links[url] = {};
            links[url]['status'] = 'true';
            links[url]['count'] = 1; 
            callback(error, url);
        }
    });
}

export const requestHandler = (url) => {
    root = url
    q = async.queue(fetchAndParser, 5)
    // links[url] = {};
    // links[url]['status'] = 'false'; 
    // links[url]['count'] = 1; 
    fs.unlink('url.csv', () => q.push(stripTrailingSlash(root)));
}