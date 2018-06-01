import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'

let BASE_URL = 'http://www.zhanqi.tv'
let ALL_VIDEO_URL = 'http://www.zhanqi.tv/api/static/v2.1/live/list/50/'

let task = {
  start () {
    console.log('zhanqi:开始抓取')
    return mysqlUtil.deleteDataByPlatform('zhanqi')
      .then(() => task.getVideos())
      .then(() => {
        return mysqlUtil.deleteDataLtViewCount('zhanqi', 100)
      }).then((data) => {
        console.log('zhanqi:抓取完成')
        return data
      })
  },
  getVideos (pageNum) {
    if (!pageNum) pageNum = 1
    let canTurnPage = false
    return crawlUtil.getHtmlTextByUrl(`${ALL_VIDEO_URL}${pageNum}.json`)
      .then((text) => {
        let videoList = JSON.parse(text).data.rooms
        let videos = []
        videoList.forEach((video) => {
          let url = video.url
          if (url.indexOf('http') === 0) url = video.url
          else url = `${BASE_URL}${url}`
          videos.push({
            title: video.title,
            url,
            imageUrl: video.bpic,
            author: video.nickname,
            personNum: Number(video.online),
            category: video.gameName,
            platform: 'zhanqi'
          })
        })
        canTurnPage = videos.length >= 50
        return task.store(videos)
      })
      .then(() => {
        if (canTurnPage) {
          return task.getVideos(pageNum + 1)
        }
      })
  },
  store (videos) {
    return mysqlUtil.insertDataByPlatform('zhanqi', videos)
  }
}

export default task
