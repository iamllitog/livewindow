import express from 'express'
import mysqlUtil from '../util/mysqlUtil'
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
  console.log(pageNum, pageCount, category, keyword, platform);
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

export default router
