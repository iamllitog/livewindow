<template>
    <div class="content">
        <div class="filter-info">
            <ul class="sorts">
                <li class="sort">
                    <a class="first active" href="#">人气从高到低</a>
                </li>
                <li class="sort dropdown">
                    <a :class="{'active': platform && platform !== ''}"
                      href="#">平台<template v-if="platform && platform !== ''">:{{platform}}</template>
                    </a>
                    <ul class="droplist">
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="" class="platformChange">全部平台</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="douyu" class="platformChange">斗鱼</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="quanmin" class="platformChange">全民</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="xiongmao" class="platformChange">熊猫</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="zhanqi" class="platformChange">战旗</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="longzhu" class="platformChange">龙珠</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="huomao" class="platformChange">火猫</a>
                        </li>
                        <li class="sort">
                            <a href="javascript:void(0)" data-platform="huya" class="platformChange">虎牙</a>
                        </li>
                    </ul>
                </li>
                <li class="sort dropdown">
                    <a :class="{'active': category !== ''}"
                      href="#">分类<template v-if="category && category !== ''">:{{category}}</template>
                    </a>
                    <ul class="droplist">
                        <li class="sort">
                            <a href="javascript:void(0)" data-category="" class="categoryChange">全部分类</a>
                        </li>
                        <li class="sort" v-for="item in categorys" :key="item.category">
                            <a href="javascript:void(0)" :data-category="item.category" class="categoryChange">{{item.category}}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <ul id="live-list-contentbox" class="play-list clearfix">
            <li v-for="live in lives">
                <a class="play-list-link" :href="live.url" :title="live.title" target="_blank">
                    <span class="imgbox">
                        <span class="imgbox-corner-mark"></span>
                        <b></b>
                        <img :data-src="live.imageUrl" style="display: block;">
                        <!-- TODO -->
                        <img class="platform-logo" :src="'/images/platform_logo/'+live.platform+'.png'">
                    </span>
                    <div class="mes">
                        <div class="mes-tit">
                            <h3 class="ellipsis">{{live.title}}</h3>
                            <span class="tag ellipsis">{{live.category}}</span>
                        </div>
                        <p>
                        <span class="dy-name ellipsis">{{live.author}}</span>
                        <span class="dy-num">{{live.personNum}}</span>
                        </p>
                    </div>
                </a>
            </li>
        </ul>
        <!-- <div class="tcd-page-code">
            <a href="javascript:void(0)" :data-page="pageNum-1" class="pageChange shark-pager-prev"
            :class="{'shark-pager-disable shark-pager-disable-prev':pageNum <= 1}">上一页</a>
            <%for (var i = startPageNum;i <= endPageNum;i++){%>
            <a href="javascript:void(0)" data-page="<%=i%>" class="pageChange shark-pager-item <% if (i === pageNum) { %>current<% } %>"><%=i%></a>
            <%}%>
            <a href="javascript:void(0)" :data-page="pageNum+1" class="pageChange shark-pager-next"
            :class="{'shark-pager-disable shark-pager-disable-next': pageNum >= pageTotalCount}">下一页</a>
            <span class="jumppage">跳转到：</span><input id="pageJumpInput" class="jumptxt" name="" type="text"><a id="pageJumpBt" href="javascript:void(0)" class="pageChange shark-pager-submit">GO</a>
        </div> -->
    </div>
</template>
<script>
// 获取直播信息
function getLives ($axios, {pageNum, category, keyword, platform}) {
  return $axios.get('/api/lives', {
    params: {
      pageNum,
      category,
      keyword,
      platform
    }
  }).then(({data}) => data.data)
}
// 获取直播分类
function getCategorys ($axios) {
  return $axios.get('/api/categorys')
    .then(({data}) => data.data.categorys)
}

export default {
  asyncData ({ $axios, query }) {
    return Promise.all([getLives($axios, query), getCategorys($axios)])
      .then(([liveInfo, categorys]) => (
        {
          lives: liveInfo.lives,
          totalCount: liveInfo.totalCount,
          pageNum: liveInfo.pageNum,
          category: liveInfo.category,
          keyword: liveInfo.keyword,
          platform: liveInfo.platform,
          categorys
        }
      ))
  }
}
</script>
<style scoped>
.content{
  max-width: 1350px;
  text-align: center;
  margin: 20px auto;
}

.filter-info,.tv-list{
  text-align: left;
}

.filter-info{
    background-color: #f5f5f5;
    border: solid 1px #e8e8e8;
    height: 39px;
}

.filter-info .sorts {
    float: left;
    line-height: 39px;
    margin: 0;
    padding: 0;
    font-size: 12px;
}

.filter-info .sorts .sort {
    float: left;
    position: relative;
}

.filter-info .sorts .sort a{
    float: left;
    display: block;
    height: 39px;
    margin-left: -1px;
    padding: 0 19px;
    border-left: solid 1px #f5f5f5;
    border-right: solid 1px #f5f5f5;
    color: #6d6d6d;
}

.filter-info .sorts .sort a.first {
    margin-left: 0;
    border-left: none;
}

.filter-info .sorts .sort a.active,.filter-info .sorts .sort a:hover{
    position: relative;
    z-index: 1;
    background-color: #fff;
    border-color: #e5e5e5;
    color: #f50;
}

.filter-info .sorts .sort ul.droplist{
    display: none;
    padding: 0;
    position: absolute;
    z-index: 2;
    top: -1px;
    left: -1px;
    border: solid 1px #ccc;
    background: #fff;
    -webkit-box-shadow: 0 3px 3px rgba(0,0,0,.1);
    -moz-box-shadow: 0 3px 3px rgba(0,0,0,.1);
    box-shadow: 0 3px 3px rgba(0,0,0,.1);
}
.filter-info .sorts .droplist .sort {
    float: none;
    white-space: nowrap;
}

.filter-info .sorts .droplist a {
    border: none;
    margin-left: 0;
    padding-right: 30px;
}

#live-list-contentbox.x10 li{width:10%}#live-list-contentbox.x9 li{width:11.1111%}#live-list-contentbox.x8 li{width:12.5%}#live-list-contentbox.x7 li{width:14.2857%}#live-list-contentbox.x6 li{width:16.6666%}#live-list-contentbox.x5 li{width:20%}#live-list-contentbox.x4 li{width:25%}#live-list-contentbox.x3 li{width:33.3333%}#live-list-contentbox.x2 li{width:50%}#live-list-contentbox.x1 li{width:100%}
#live-list-contentbox li{
    display: inline-block;
    margin-bottom: 20px;
}

.play-list {
    padding: 0;
}

.play-list li a {
    display: block;
    border-bottom: 3px solid transparent;
    transition: all .3s ease-in;
    -webkit-transition: all .3s ease-in;
    -moz-transition: all .3s ease-in;
    font-size: 0;
    background: #fff;
    margin-right: 10px;
    text-decoration: none;
}

.play-list li .imgbox {
    cursor: pointer;
    display: block;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.play-list li .imgbox-corner-mark {
    position: absolute;
    top: 0;
    left: 0;
}

.play-list li .imgbox>b {
    display: block;
    width: 50px;
    height: 50px;
    background: url(/images/playIcon.png) no-repeat;
    position: absolute;
    top: 80%;
    left: 50%;
    margin-top: -25px;
    margin-left: -25px;
    opacity: 0;
    filter: alpha(opacity=0);
    transition: all .3s ease;
}

.play-list li .imgbox>img {
    width: 100%;
    height: 180px;
}


.play-list li .imgbox>img.platform-logo {
    width: 70px;
    height: auto;
    position: absolute;
    left: 0;
    top: 10px;
}


.play-list li .mes {
    background: #fff;
    padding: 5px 5px 3px;
    line-height: 20px;
    font-size: 12px;
    height: 48px;
    overflow: hidden;
}

.play-list li .mes-tit {
    color: #313131;
    position: relative;
}

.play-list li .mes-tit h3 {
    width: 70%;
    font-size: 14px;
    color: #313131;
    margin: 0;
    font-weight: 500;
    text-decoration : none;
}

.play-list li .mes-tit .tag {
    display: block;
    width: 60px;
    font-size: 12px;
    text-align: right;
    color: #f60;
    position: absolute;
    right: 0;
    top: 0;
}

.play-list li p {
    height: 20px;
    padding-top: 5px;
    overflow: hidden;
    margin: 0;
}

.play-list li p span.dy-name {
    float: left;
    background-position: -2px 4px;
    max-width: 180px;
}

.play-list li p span {
    display: block;
    padding-left: 18px;
    font-size: 12px;
    background: url(/images/mem-icos.png) no-repeat;
    color: #797979;
}

.play-list li p span.dy-num {
    float: right;
    background-position: 0 -30px;
}

.play-list li a:hover {
    border-bottom-color: #d2d2d2;
}

.play-list li a:hover b {
    top: 50%;
    opacity: 1;
    filter: alpha(opacity=100);
    z-index: 1;
}

.play-list li a:hover .mes-tit, .play-list li a:hover h3 {
    color: #f70;
}

.tcd-page-code {
    padding: 20px 0 30px;
    text-align: center;
    font-size: 12px;
}

.tcd-page-code a.shark-pager-disable {
    display: inline-block;
    height: 26px;
    text-align: center;
    line-height: 26px;
    color: #bfbfbf;
    margin: 0 5px;
    border: 1px solid #bfbfbf;
    border-radius: 3px;
}

.tcd-page-code a.shark-pager-disable:hover {
    border: 1px solid #bfbfbf;
    background: 0 0;
    cursor: text;
    color: #bfbfbf;
}

.tcd-page-code a.shark-pager-next, .tcd-page-code a.shark-pager-prev {
    width: 60px;
}

.tcd-page-code a {
    height: 26px;
    color: #7f7f7f;
    border: 1px solid #d5d5d5;
    border-radius: 3px;
}

.tcd-page-code a, .tcd-page-code a.current {
    width: 34px;
    text-align: center;
    line-height: 26px;
    margin: 0 5px;
    display: inline-block;
}

.tcd-page-code a.current {
    height: 26px;
    border-radius: 3px;
}

.tcd-page-code .jumppage {
    margin-left: 20px;
    color: #7f7f7f;
    line-height: 28px;
}

.tcd-page-code .jumptxt {
    width: 34px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d5d5d5;
    padding: 0 5px;
    vertical-align: top;
}

.tcd-page-code a.current, .tcd-page-code a:hover {
    background: #2d3e50;
    color: #fff;
    border: 1px solid #2d3e50;
}

</style>
