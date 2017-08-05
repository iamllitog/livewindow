var douyuTask = require('./douyu');
var huomaoTask = require('./huomao');
var xiongmaoTask = require('./xiongmao');
var quanminTask = require('./quanmin');
var zhanqiTask = require('./zhanqi');
var longzhuTask = require('./longzhu');

function timer(){
    // Promise.all([douyuTask.start(),huomaoTask.start(),xiongmaoTask.start(),quanminTask.start(),zhanqiTask.start(),longzhuTask.start()])
    douyuTask.start()
    .then(() => (huomaoTask.start()))
    .then(() => (xiongmaoTask.start()))
    .then(() => (quanminTask.start()))
    .then(() => (zhanqiTask.start()))
    .then(() => (longzhuTask.start()))
    .catch((err) => {
        console.error(err);
    })
    .then((data) => {
        console.log('抓取完成');
        setTimeout(() => {
            timer();
        },60*1000*10);
    });
}

module.exports = function(){
    timer();
};