const crawlUtil = require('../util/crawlUtil');
const mysqlUtil = require('../util/mysqlUtil');
const cheerio = require("cheerio");

let BASE_URL = "https://www.quanmin.tv";
let ALL_VIDEO_URL = "https://www.quanmin.tv/game/all?p=";

module.exports = {
    start() {
        console.log('quanmin:开始抓取');
        return mysqlUtil.deleteDataByPlatform('quanmin')
        .then(() => {
            return this.getVideos();
        }).then((data) => {
            console.log('quanmin:抓取完成');
            return data;
        });
    },
    getVideos (pageNum){
        if (!pageNum)   pageNum = 1;
        let canTurnPage = false;
        return crawlUtil.getHtmlTextByUrl(ALL_VIDEO_URL+pageNum)
        .then((text) => {
            var $ = cheerio.load(text);
            let allVideos = $('#list_w-video-list .list_w-videos').not('.single_line').find('li');
            let videos = [];
            allVideos.each((index,item) => {
                let personNum = Number($(item).find('.common_w-card_views-num').text());
                if (!isNaN(personNum) && personNum >= 100){
                    videos.push({
                        title : $(item).find('.common_w-card_title').text(),
                        url : $(item).find('.common_w-card_href').attr('href'),
                        imageUrl : $(item).find('.common_w-card_cover-wrap img.common_w-card_cover').attr('src'),
                        author : $(item).find('.common_w-card_host-name').text(),
                        personNum,
                        category : $(item).find('.common_w-card_category').text(),
                        platform : 'quanmin'
                    });
                }
            });
            canTurnPage = allVideos.length <= videos.length;
            return this.store(videos);
        })
        .then(() => {
            if (canTurnPage){
                return this.getVideos(pageNum+1);
            }
        });
    },
    store (videos){
        return mysqlUtil.insertDataByPlatform('quanmin',videos);
    },
};