import Promise from 'bluebird'
Promise.config({
  cancellation: true
})

function timeRetryPromise (promiseFun, ms, retry) {
  --retry
  function timeout () {
    return new Promise((resolve, reject, onCancel) => {
      let tp = setTimeout(function () {
        resolve('timeout')
      }, ms)
      onCancel(function () {
        clearTimeout(tp)
      })
    })
  }

  let promise = promiseFun()
  let timeoutPromise = timeout()

  return Promise.race([promise, timeoutPromise])
    .then((result) => {
      if (result === 'timeout') {
        promise.cancel()
        if (retry > 0) {
          return timeRetryPromise(promiseFun, ms, retry)
        } else {
          throw new Error('任务超时，并超过指定次数')
        }
      } else {
        timeoutPromise.cancel()
        return result
      }
    })
}

export default {
  timeRetryPromise
}
