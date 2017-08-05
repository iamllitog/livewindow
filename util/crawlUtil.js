const request = require("request");

module.exports = {
    getHtmlTextByUrl (url){
        var options = {
            method: 'GET',
            url,
            headers:{
                'cache-control': 'no-cache' 
            }
        };

        return new Promise((resolve,reject) => {
            request(options, function (error, response, body) {
                if (error){
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }
};