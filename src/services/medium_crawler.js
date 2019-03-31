import request from 'request'
import fs from 'fs'
import cheerio from 'cheerio'
import async from 'async'
import create from './createData'
import update from './updateData'

var rootURL = ''
var que = null
var links = {}
var link = ''

const stripSlash = (str) => {    
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

const htmlScrapper = (body) => {

    let ch = cheerio.load(body);

    // filter links only belongs medium.com
    ch(`a[href^="${rootURL}"]`).each((i, a) => {

        // Ignore query params. Those point to same URL
        let params = []
        params = getParamsFromURL(a.attribs.href.split('?')[1])
        link = stripSlash(a.attribs.href.split('?')[0])
        
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

            que.push(link);
            try{
                create(link, links[link]['count'], links[link]['params'])
            }catch(e){
                update(link, links[link]['count'], links[link]['params'])
            }
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
            update(link, links[link]['count'], links[link]['params'])
        }        
    }); 
}

const fetchAndParser = (url, callback) => {
    request(url, (error, response, body) => {
        if (error) {
            console.log("Network Error", error);
            callback(error, url);
        } else {
            htmlScrapper(body);
            links[url] = {};
            links[url]['status'] = 'true';
            links[url]['count'] = 1; 
            callback(error, url);
        }
    });
}

export const requestHandler = (url) => {
    rootURL = url
    que = async.queue(fetchAndParser, 5)
    fs.unlink('url.csv', () => que.push(stripSlash(rootURL)));
}