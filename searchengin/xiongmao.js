const crawlUtil = require('../util/crawlUtil');
const mysqlUtil = require('../util/mysqlUtil');

let BASE_URL = "https://www.panda.tv";
let ALL_VIDEO_URL = "https://www.panda.tv/live_lists?status=2&order=person_num&token=&pagenum=120&pageno=";

let task = {
    start() {
        console.log('xiongmao:开始抓取');
        return mysqlUtil.deleteDataByPlatform('xiongmao')
        .then(() => {
            return task.getVideos();
        }).then((data) => {
            console.log('xiongmao:抓取完成');
            return data;
        });
    },
    getVideos (pageNum){
        if (!pageNum)   pageNum = 1;
        let canTurnPage = false;
        return crawlUtil.getHtmlTextByUrl(ALL_VIDEO_URL+pageNum)
        .then((text) => {
            let videoList = JSON.parse(text).data.items;
            let videos = [];
            videoList.forEach((video) => {
                if(Number(video.person_num) >= 100){
                    videos.push({
                        title : video.name,
                        url : `${BASE_URL}/${video.id}`,
                        imageUrl : video.pictures.img,
                        author : video.userinfo.nickName,
                        personNum : Number(video.person_num),
                        category : video.classification.cname,
                        platform : 'xiongmao'
                    });
                }
            });
            canTurnPage = videoList.length <= videos.length;
            return task.store(videos);
        })
        .then(() => {
            if (canTurnPage){
                return task.getVideos(pageNum+1);
            }
        });
    },
    store (videos){
        return mysqlUtil.insertDataByPlatform('xiongmao',videos);
    },
};

module.exports = task;