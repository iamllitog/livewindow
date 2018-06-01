import douyuTask from './douyu'
import huomaoTask from './huomao'
import xiongmaoTask from './xiongmao'
import quanminTask from './quanmin'
import zhanqiTask from './zhanqi'
import longzhuTask from './longzhu'
import huyaTask from './huya'
import promiseUtil from '../util/promiseUtil'

let time = 2 * 60 * 1000

export default function () {
  return promiseUtil.timeRetryPromise(douyuTask.start, time, 3)
    .then(() => (promiseUtil.timeRetryPromise(huomaoTask.start, time, 3)))
    .then(() => (promiseUtil.timeRetryPromise(xiongmaoTask.start, time, 3)))
    .then(() => (promiseUtil.timeRetryPromise(quanminTask.start, time, 3)))
    .then(() => (promiseUtil.timeRetryPromise(zhanqiTask.start, time, 3)))
    .then(() => (promiseUtil.timeRetryPromise(longzhuTask.start, time, 3)))
    .then(() => (promiseUtil.timeRetryPromise(huyaTask.start, time, 3)))
    .catch((err) => {
      console.error(err)
    })
    .then((data) => {
      console.log('抓取完成')
    })
}
