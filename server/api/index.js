import express from 'express'
import mysqlUtil from '../util/mysqlUtil'
import statisticsAuthor from '../statistics/author'
const router = express.Router()

router.get('/lives', (req, res, next) => {
  let pageNum = parseInt(req.query.pageNum)
  let category = req.query.category
  let keyword = req.query.keyword
  let platform = req.query.platform
  let pageCount = 50
  if (isNaN(pageNum) || pageNum < 1) {
    pageNum = 1
  }
  if (!category || category.trim() === '') {
    category = ''
  }
  if (!keyword || keyword.trim() === '') {
    keyword = ''
  }
  if (!platform || platform.trim() === '') {
    platform = ''
  }
  mysqlUtil.getLives({pageNum, pageCount, category, keyword, platform})
    .then(({lives, totalCount}) => {
      res.json({
        success: 1,
        data: {
          lives,
          totalCount,
          pageNum,
          category,
          keyword,
          platform
        }
      })
    })
})

router.get('/categorys', (req, res, next) => {
  mysqlUtil.getCategory(5)
    .then((categorys) => {
      res.json({
        success: 1,
        data: {
          categorys
        }
      })
    })
})

router.get('/report/dayactiveanchor', (req, res, next) => {
  statisticsAuthor.getDayactiveanchor()
    .then((data) => {
      let reportData = {
        xAxis: null,
        data: null
      }
      reportData.xAxis = data.dates.map((item) => item.collectDate)
      let xaxisLen = reportData.xAxis.length
      reportData.data = data.datas.map((rows) => {
        rows.data = rows.data.map((item) => item.authorNum)
        let unshiftLen = xaxisLen - rows.data.length
        for (let index = 0; index < unshiftLen; index++) {
          rows.data.unshift(null)
        }
        return rows
      })
      res.json({
        success: 1,
        data: {
          reportTab: 'dayactiveanchor',
          reportData
        }
      })
    })
})

export default router
