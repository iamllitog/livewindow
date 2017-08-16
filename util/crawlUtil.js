const unirest = require("unirest");
const Promise = require('bluebird');
Promise.config({
    cancellation: true,
});

module.exports = {
    getHtmlTextByUrl (url){
        var req = unirest("GET", url);
        req.headers({
          "cache-control": "no-cache"
        });
        return new Promise((resolve,reject) => {
            req.end(function (res) {
                if (res.error) reject(res.error);
                else resolve(res.raw_body);
            });
        });
    }
};