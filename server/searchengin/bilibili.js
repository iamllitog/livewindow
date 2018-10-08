import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'

let BASE_URL = 'https://live.bilibili.com'
let VIDEO_AJAX_URL = 'https://api.live.bilibili.com/room/v1/room/get_user_recommend?page='

const task = {
  start () {
    console.log('bilibili:开始抓取')
    return mysqlUtil.deleteDataByPlatform('bilibili')
      .then(() => task.getVideos())
      .then((data) => {
        console.log('bilibili:抓取完成')
        return data
      })
  },
  getVideos (pageNum) {
    if (!pageNum) pageNum = 1
    let canTurnPage = false
    return crawlUtil.getHtmlTextByUrl(VIDEO_AJAX_URL + pageNum)
      .then((text) => {
        let datalist = JSON.parse(text).data
        let videos = []
        datalist.forEach((video) => {
          if (video.online >= 100) {
            videos.push({
              title: video.title,
              url: `${BASE_URL}/${video.link}`,
              imageUrl: video.system_cover,
              author: video.uname,
              personNum: video.online,
              category: '暂无分类',
              platform: 'bilibili'
            })
          }
        })

        canTurnPage = datalist.length <= videos.length
        console.log(videos.length);
        return task.store(videos)
      })
      .then(() => {
        if (canTurnPage) {
          return task.getVideos(pageNum + 1)
        }
      })
  },
  store (videos) {
    return mysqlUtil.insertDataByPlatform('bilibili', videos)
  }
}

export default task
