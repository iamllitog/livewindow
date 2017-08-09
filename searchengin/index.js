var douyuTask = require('./douyu');
var huomaoTask = require('./huomao');
var xiongmaoTask = require('./xiongmao');
var quanminTask = require('./quanmin');
var zhanqiTask = require('./zhanqi');
var longzhuTask = require('./longzhu');

module.exports = function(){
    return douyuTask.start()
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
    });
};