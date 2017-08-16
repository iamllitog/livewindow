var douyuTask = require('./douyu');
var huomaoTask = require('./huomao');
var xiongmaoTask = require('./xiongmao');
var quanminTask = require('./quanmin');
var zhanqiTask = require('./zhanqi');
var longzhuTask = require('./longzhu');
const promiseUtil = require('../util/promiseUtil');

let time = 2 * 60 * 1000;

module.exports = function(){
    return promiseUtil.timeRetryPromise(douyuTask.start,time,3)
    .then(() => (promiseUtil.timeRetryPromise(huomaoTask.start,time,3)))
    .then(() => (promiseUtil.timeRetryPromise(xiongmaoTask.start,time,3)))
    .then(() => (promiseUtil.timeRetryPromise(quanminTask.start,time,3)))
    .then(() => (promiseUtil.timeRetryPromise(zhanqiTask.start,time,3)))
    .then(() => (promiseUtil.timeRetryPromise(longzhuTask.start,time,3)))
    .catch((err) => {
        console.error(err);
    })
    .then((data) => {
        console.log('抓取完成');
    });
};