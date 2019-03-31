// asynchornous
// maintain concurrency of 5 request at a time...should not blocked
// request.js no need to use connectionpool
// not allowed to use external scrapping and async tool
// Refrain from using throttled-request package to limit concurrency
// https://stackoverflow.com/questions/34855352/how-in-general-does-node-js-handle-10-000-concurrent-requests

import {requestHandler} from './src/services/medium_crawler';
const url = "https://medium.com";

requestHandler(url);