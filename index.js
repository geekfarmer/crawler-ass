import {requestHandler} from './src/services/medium_crawler';
import Queue from './src/services/queue'

const url = "https://medium.com";

//start scrapper service
requestHandler(url, 5);
