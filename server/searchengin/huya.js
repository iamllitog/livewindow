import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'

let BASE_URL = 'http://www.huya.com'
let VIDEO_AJAX_URL = 'http://www.huya.com/cache.php?m=LiveList&do=getLiveListByPage&tagAll=0&page='

const task = {
  start () {
    console.log('huya:开始抓取')
    return mysqlUtil.deleteDataByPlatform('huya')
      .then(() => task.getVideos())
      .then(() => mysqlUtil.deleteDataLtViewCount('huya', 100))
      .then((data) => {
        console.log('huya:抓取完成')
        return data
      })
  },
  getVideos (pageNum) {
    if (!pageNum) pageNum = 1
    let canTurnPage = false
    return crawlUtil.getHtmlTextByUrl(VIDEO_AJAX_URL + pageNum)
      .then((text) => {
        let datas = JSON.parse(text).data.datas
        let videos = []
        datas.forEach((video) => {
          videos.push({
            title: video.introduction,
            url: `${BASE_URL}/${video.privateHost}`,
            imageUrl: video.screenshot,
            author: video.nick,
            personNum: Number(video.totalCount),
            category: video.gameFullName,
            platform: 'huya'
          })
        })
        canTurnPage = videos.length >= 120 && pageNum <= 200
        return task.store(videos)
      })
      .then(() => {
        if (canTurnPage) {
          return task.getVideos(pageNum + 1)
        }
      })
  },
  store (videos) {
    return mysqlUtil.insertDataByPlatform('huya', videos)
  }
}

export default task
