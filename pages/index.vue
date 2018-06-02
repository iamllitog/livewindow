<template>
    <div class="content">
        <div class="filter-info">
            <ul class="sorts">
                <li class="sort">
                    <a class="first active" href="#">人气从高到低</a>
                </li>
                <li class="sort dropdown">
                    <a :class="{'active': platform && platform !== ''}"
                      href="#">平台<template v-if="platform && platform !== ''">:{{platformText}}</template>
                    </a>
                    <ul class="droplist">
                        <li class="sort" v-for="item in platformList" :key="item.value">
                            <a href="javascript:void(0)" @click="changePlatform(item.value)" class="platformChange">{{item.label}}</a>
                        </li>
                    </ul>
                </li>
                <li class="sort dropdown">
                    <a :class="{'active': category !== ''}"
                      href="#">分类<template v-if="category && category !== ''">:{{category}}</template>
                    </a>
                    <ul class="droplist">
                        <li class="sort">
                            <a href="javascript:void(0)" @click="changeCategory('')" class="categoryChange">全部分类</a>
                        </li>
                        <li class="sort" v-for="item in categorys" :key="item.category">
                            <a href="javascript:void(0)" @click="changeCategory(item.category)" class="categoryChange">{{item.category}}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <ul id="live-list-contentbox" class="play-list clearfix">
            <li v-for="live in lives" :key="live.url+live.author">
                <a class="play-list-link" :href="live.url" :title="live.title" target="_blank">
                    <span class="imgbox">
                        <span class="imgbox-corner-mark"></span>
                        <b></b>
                        <img v-lazy="live.imageUrl" style="display: block;">
                        <img class="platform-logo" :src="'/platform_logo/'+live.platform+'.png'">
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
        <Pagination
          :total-count="totalCount"
          :pre-page-size="50"
          v-model="pageNum"
        ></Pagination>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
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
  components: {Pagination},
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
  },
  data () {
    return {
      platformList: [
        {label: '全部平台', value: ''},
        {label: '斗鱼', value: 'douyu'},
        {label: '全民', value: 'quanmin'},
        {label: '熊猫', value: 'xiongmao'},
        {label: '战旗', value: 'zhanqi'},
        {label: '龙珠', value: 'longzhu'},
        {label: '火猫', value: 'huomao'},
        {label: '虎牙', value: 'huya'}
      ]
    }
  },
  computed: {
    // 当前平台中文名
    platformText () {
      let currentPlatform = this.platformList.find(({value}) => value === this.platform)
      if (currentPlatform) return currentPlatform.label
      return null
    }
  },
  methods: {
    // 获取直播数据
    getLives () {
      getLives(this.$axios, {
        pageNum: this.pageNum,
        category: this.category,
        keyword: this.keyword,
        platform: this.platform
      }).then((liveInfo) => {
        this.lives = liveInfo.lives
        this.totalCount = liveInfo.totalCount
        this.pageNum = liveInfo.pageNum
        this.category = liveInfo.category
        this.keyword = liveInfo.keyword
        this.platform = liveInfo.platform
      })
    },
    // 改变平台
    changePlatform (platform) {
      this.$router.push({
        path: '/',
        query: {
          ...this.$route.query,
          pageNum: 1,
          platform
        }
      })
    },
    // 改变类别
    changeCategory (category) {
      this.$router.push({
        path: '/',
        query: {
          ...this.$route.query,
          pageNum: 1,
          category
        }
      })
    }
  },
  watch: {
    // 当页码改变时重新获取数据
    pageNum (pageNum) {
      this.$router.push({
        path: '/',
        query: {
          ...this.$route.query,
          pageNum
        }
      })
    },
    // 当路由查询条件变化时，更新数据
    '$route.query' (queryObj) {
      this.pageNum = Number(queryObj.pageNum) || 1
      this.category = queryObj.category || ''
      this.keyword = queryObj.keyword || ''
      this.platform = queryObj.platform || ''
      this.getLives()
    }
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
.filter-info .sorts .dropdown:hover ul.droplist{
    display: block;
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

#live-list-contentbox{
    text-align: left;
}
#live-list-contentbox li{
    display: inline-block;
    margin-bottom: 20px;
}

@media only screen and (max-width: 90px) {
  #live-list-contentbox li {
    width: 100%;
  }
}
@media only screen and (min-width: 90px) and (max-width: 420px) {
  #live-list-contentbox li {
    width: 50%;
  }
}
@media only screen and (min-width: 420px) and (max-width: 750px) {
  #live-list-contentbox li {
    width: 33.3333%;
  }
}
@media only screen and (min-width: 750px) and (max-width: 1080px) {
  #live-list-contentbox li {
    width: 25%;
  }
}
@media only screen and (min-width: 1080px) and (max-width: 1410px) {
  #live-list-contentbox li {
    width: 20%;
  }
}
@media only screen and (min-width: 1410px) and (max-width: 1740px) {
  #live-list-contentbox li {
    width: 16.6666%;
  }
}
@media only screen and (min-width: 1740px) and (max-width: 2070px) {
  #live-list-contentbox li {
    width: 14.2857%;
  }
}
@media only screen and (min-width: 2070px) and (max-width: 2400px) {
  #live-list-contentbox li {
    width: 12.5%;
  }
}
@media only screen and (min-width: 2400px) and (max-width: 2730px) {
  #live-list-contentbox li {
    width: 11.1111%;
  }
}
@media only screen and (min-width: 2730px) {
  #live-list-contentbox li {
    width: 10%;
  }
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
    background: url(~/assets/images/playIcon.png) no-repeat;
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
    background: url(~/assets/images/mem-icos.png) no-repeat;
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

</style>
