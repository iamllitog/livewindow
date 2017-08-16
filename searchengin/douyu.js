const cheerio = require("cheerio");
const crawlUtil = require('../util/crawlUtil');
const stringUtil = require('../util/stringUtil');
const mysqlUtil = require('../util/mysqlUtil');

let BASE_URL = "https://www.douyu.com";
let ALL_VIDEOS_URL = `https://www.douyu.com/directory/all?isAjax=1&page=`;

let task = {
    start() {
        console.log('douyu:开始抓取');
        return mysqlUtil.deleteDataByPlatform('douyu')
        .then(() => {
            return task.getVideos();
        })
        .then(() => {
            return mysqlUtil.deleteDataLtViewCount('douyu',100);
        })
        .then((data) => {
            console.log('douyu:抓取完成');
            return data;
        });
    },
    getVideos (pageNum){
        if (!pageNum)   pageNum = 1;
        let canTurnPage = false;
        return crawlUtil.getHtmlTextByUrl(ALL_VIDEOS_URL + pageNum)
        .then((text) => {
            var $ = cheerio.load(text);
            let lives = [];
            $('li').each((index,item) => {
                let personNum = stringUtil.toNormalNumber($(item).find('.mes .dy-num').text());
                lives.push({
                    title : $(item).find('a').attr('title'),
                    url : `${BASE_URL}${$(item).find('a').attr('href')}`,
                    imageUrl : $(item).find('img').attr('data-original'),
                    author : $(item).find('.mes .dy-name').text(),
                    personNum,
                    category : $(item).find('.mes-tit span.tag').text().trim(),
                    platform : 'douyu'
                });
            });

            canTurnPage = lives.length >= 120 && pageNum <= 150;
            return task.store(lives);
        })
        .then(() => {
            if (canTurnPage){
                return task.getVideos(pageNum+1);
            }
        });
    },
    store (videos){
        return mysqlUtil.insertDataByPlatform('douyu',videos);
    }
};

module.exports = task;