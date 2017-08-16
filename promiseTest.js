const Promise = require('bluebird');
const retry = require('bluebird-retry');
Promise.config({
    cancellation: true,
});

function testPromise (){
    return new Promise((resolve) => {
        setTimeout(function() {
            resolve();
        }, 1000);
    })
    .then(() => {
        console.log('第一任务完成');
        return new Promise((resolve) => {
            setTimeout(function() {
                resolve();
            }, 3000);
        });
    })
    .then(() => {
        console.log('第二任务完成');
        return new Promise((resolve) => {
            setTimeout(function() {
                console.log('任务完成');
                resolve();
            }, 1000);
        });
    });
}

function timeRetryPromise (promiseFun,ms,retry){
    --retry;
    function timeout(){
        return new Promise((resolve,reject,onCancel) => {
            let tp = setTimeout(function() {
                resolve('timeout');
            }, ms);
            onCancel(function() {
                clearTimeout(tp);
            });
        });
    }

    let promise = promiseFun();
    let timeoutPromise = timeout();

    return Promise.race([promise,timeoutPromise])
    .then((result) => {
        if (result === 'timeout'){
            promise.cancel();
            if (retry > 0){
                return timeRetryPromise(promiseFun,ms,retry);
            } else{
                throw new Error('任务超时，并超过指定次数');
            }
        } else {
            timeoutPromise.cancel();
            return result;
        }
    });
}

timeRetryPromise(testPromise,10000,3)