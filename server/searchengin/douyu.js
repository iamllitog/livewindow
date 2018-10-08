import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'

const BASE_URL = 'https://www.douyu.com'
const ALL_VIDEOS_URL = `https://www.douyu.com/gapi/rkc/directory/0_0/`

const task = {
  start () {
    console.log('douyu:开始抓取')
    return mysqlUtil.deleteDataByPlatform('douyu')
      .then(() => task.getVideos())
      .then(() => mysqlUtil.deleteDataLtViewCount('douyu', 100))
      .then((data) => {
        console.log('douyu:抓取完成')
        return data
      })
  },
  getVideos (pageNum) {
    if (!pageNum) pageNum = 1
    let canTurnPage = false
    return crawlUtil.getHtmlTextByUrl(ALL_VIDEOS_URL + pageNum)
      .then((text) => {
        let datas = JSON.parse(text).data.rl
        let videos = []
        datas.forEach((video) => {
          videos.push({
            title: video.rn,
            url: `${BASE_URL}${video.url}`,
            imageUrl: video.rs1,
            author: video.nn,
            personNum: Number(video.ol),
            category: video.c2name,
            platform: 'douyu'
          })
        })
        canTurnPage = videos.length >= 120 && pageNum <= 150
        return task.store(videos)
      })
      .then(() => {
        if (canTurnPage) {
          return task.getVideos(pageNum + 1)
        }
      })
  },
  store (videos) {
    return mysqlUtil.insertDataByPlatform('douyu', videos)
  }
}

export default task
