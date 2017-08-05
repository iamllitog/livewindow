const crawlUtil = require('../util/crawlUtil');
const mysqlUtil = require('../util/mysqlUtil');

let BASE_URL = "https://www.huomao.com";
let VIDEO_AJAX_URL = "https://www.huomao.com/channels/channel.json?game_url_rule=all&page=";

module.exports = {
    start() {
        console.log('huomao:开始抓取');
        return mysqlUtil.deleteDataByPlatform('huomao')
        .then(() => {
            return this.getVideos();
        }).then((data) => {
            console.log('huomao:抓取完成');
            return data;
        });
    },
    getVideos (pageNum){
        if (!pageNum)   pageNum = 1;
        let canTurnPage = false;
        return crawlUtil.getHtmlTextByUrl(VIDEO_AJAX_URL + pageNum)
        .then((text) => {
            let channelList = JSON.parse(text).data.channelList;
            let videos = [];
            channelList.forEach((video) => {
                if(video.is_live === 1 && video.originviews >= 100){
                    videos.push({
                        title : video.channel,
                        url : `${BASE_URL}/${video.id}`,
                        imageUrl : video.image,
                        author : video.username,
                        personNum : video.originviews,
                        category : video.gameCname,
                        platform : 'huomao'
                    });
                }
            });

            canTurnPage = channelList.length <= videos.length;
            return this.store(videos);
        })
        .then(() => {
            if (canTurnPage){
                return this.getVideos(pageNum+1);
            }
        });
    },
    store (videos){
        return mysqlUtil.insertDataByPlatform('huomao',videos);
    },
};