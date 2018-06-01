import author from './author'

export default {
  collect () {
    return author.collect()
      .catch((err) => {
        console.error(err)
      })
      .then((data) => {
        console.log('主播数据收集完成')
      })
  },
  timeTask () {
    return author.timeTask()
      .catch((err) => {
        console.error(err)
      })
      .then((data) => {
        console.log('主播定时任务完成')
      })
  }
}
