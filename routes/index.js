var express = require('express');
var router = express.Router();
const mysqlUtil = require('../util/mysqlUtil');

var platforms = require('../config').platforms;

/* GET home page. */
router.get('/', function(req, res, next) {
  let pageNum = parseInt(req.query.pageNum);
  let category = req.query.category;
  let keyword = req.query.keyword;
  let platform = req.query.platform;
  if (isNaN(pageNum) || pageNum <1){
      pageNum = 1;
  }
  if (!category || category.trim() === ''){
      category = '';
  }
  if (!keyword || keyword.trim() === ''){
      keyword = '';
  }
  if (!platform || platform.trim() === ''){
      platform = '';
  }
  let pageCount = 50;
  Promise.all([mysqlUtil.getCategory(5),mysqlUtil.getLives({pageNum,pageCount,category,keyword,platform})])
  .then(([categorys,{lives,totalCount}]) => {
      let pageTotalCount = parseInt(totalCount / pageCount) + 1;
      let startPageNum = parseInt((pageNum-1) /10) * 10 + 1;
      let endPageNum = (parseInt((pageNum-1) /10) + 1) * 10 + 1;
      if (pageTotalCount < endPageNum) endPageNum = pageTotalCount;
      platform = platforms.find(function(val){return val.name === platform});
      if (platform)  platform = platform.chtext;
      res.render('index',{lives,categorys,totalCount,pageNum,startPageNum,endPageNum,pageTotalCount,category,keyword,platform});
  });
  
});

module.exports = router;
