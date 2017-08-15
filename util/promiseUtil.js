function timeRetryPromise (promiseFun,ms,retry){
    --retry;
    function timeout(){
        return new Promise((resolve) => {
            setTimeout(function() {
                resolve('timeout');
            }, ms);
        });
    }

    let promise = promiseFun();

    return Promise.race([promise,timeout()])
    .then((result) => {
        if (result === 'timeout'){
            promise.cancel();
            if (retry > 0){
                return timeRetryPromise(promiseFun,ms,retry);
            } else{
                throw new Error('任务超时，并超过指定次数');
            }
        } else {
            return result;
        }
    });
}

module.exports = {
    timeRetryPromise
};