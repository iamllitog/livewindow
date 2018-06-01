import cheerio from 'cheerio'
import crawlUtil from '../util/crawlUtil'
import mysqlUtil from '../util/mysqlUtil'
import { toNormalNumber } from '../util/stringUtil'

const BASE_URL = 'https://www.douyu.com'
const ALL_VIDEOS_URL = `https://www.douyu.com/directory/all?isAjax=1&page=`

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
        let $ = cheerio.load(text)
        let lives = []
        $('li').each((index, item) => {
          let personNum = toNormalNumber($(item).find('.mes .dy-num').text())
          lives.push({
            title: $(item).find('a').attr('title'),
            url: `${BASE_URL}${$(item).find('a').attr('href')}`,
            imageUrl: $(item).find('img').attr('data-original'),
            author: $(item).find('.mes .dy-name').text(),
            personNum,
            category: $(item).find('.mes-tit span.tag').text().trim(),
            platform: 'douyu'
          })
        })

        canTurnPage = lives.length >= 120 && pageNum <= 150
        return task.store(lives)
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
