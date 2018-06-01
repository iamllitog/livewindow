import cheerio from 'cheerio'
import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'

// let BASE_URL = 'https://www.quanmin.tv'
let ALL_VIDEO_URL = 'https://www.quanmin.tv/game/all?p='

const task = {
  start () {
    console.log('quanmin:开始抓取')
    return mysqlUtil.deleteDataByPlatform('quanmin')
      .then(() => task.getVideos())
      .then((data) => {
        console.log('quanmin:抓取完成')
        return data
      })
  },
  getVideos (pageNum) {
    if (!pageNum) pageNum = 1
    let canTurnPage = false
    return crawlUtil.getHtmlTextByUrl(ALL_VIDEO_URL + pageNum)
      .then((text) => {
        var $ = cheerio.load(text)
        let allVideos = $('#list_w-video-list .list_w-videos').not('.single_line').find('li')
        let videos = []
        allVideos.each((index, item) => {
          let personNum = Number($(item).find('.common_w-card_views-num').text())
          if (!isNaN(personNum) && personNum >= 100) {
            videos.push({
              title: $(item).find('.common_w-card_title').text(),
              url: $(item).find('.common_w-card_href').attr('href'),
              imageUrl: $(item).find('.common_w-card_cover-wrap img.common_w-card_cover').attr('src'),
              author: $(item).find('.common_w-card_host-name').text(),
              personNum,
              category: $(item).find('.common_w-card_category').text(),
              platform: 'quanmin'
            })
          }
        })
        canTurnPage = allVideos.length <= videos.length
        return task.store(videos)
      })
      .then(() => {
        if (canTurnPage) {
          return task.getVideos(pageNum + 1)
        }
      })
  },
  store (videos) {
    return mysqlUtil.insertDataByPlatform('quanmin', videos)
  }
}

export default task
