import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'

// let BASE_URL = 'http://longzhu.com'
let ALL_VIDEO_URL = 'http://api.plu.cn/tga/streams?sort-by=views&filter=0&game=0'
let PAGE_COUNT = 50

const task = {
  start () {
    console.log('longzhu:开始抓取')
    return mysqlUtil.deleteDataByPlatform('longzhu')
      .then(() => task.getVideos())
      .then((data) => {
        console.log('longzhu:抓取完成')
        return data
      })
  },
  getVideos (pageNum) {
    if (!pageNum) pageNum = 1
    let startIndex = (pageNum - 1) * PAGE_COUNT
    let canTurnPage = false
    return crawlUtil.getHtmlTextByUrl(`${ALL_VIDEO_URL}&max-results=${PAGE_COUNT}&start-index=${startIndex}`)
      .then((text) => {
        let videoList = JSON.parse(text).data.items
        let videos = []
        videoList.forEach((video) => {
          let personNum = Number(video.viewers)
          if (!isNaN(personNum) && personNum >= 100) {
            videos.push({
              title: video.channel.status,
              url: video.channel.url,
              imageUrl: video.preview,
              author: video.channel.name,
              personNum,
              category: video.game[0].name,
              platform: 'longzhu'
            })
          }
        })
        canTurnPage = videoList.length <= videos.length
        return task.store(videos)
      })
      .then(() => {
        if (canTurnPage) {
          return task.getVideos(pageNum + 1)
        }
      })
  },
  store (videos) {
    return mysqlUtil.insertDataByPlatform('longzhu', videos)
  }
}

export default task
