<template>
  <div>
    <ul class="news-ul">
      <li class="news-li" v-for="item in news" :key="item.id">
        <h4 class="title">{{item.title}}</h4>
        <p class="time">{{item.time}}</p>
        <p class="detail">{{item.detailtext}}</p>
      </li>
    </ul>
    <Pagination
      :total-count="totalCount"
      :pre-page-size="20"
      v-model="pageNum"
    ></Pagination>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
// 获取直播分类
function getNews ($axios, {pageNum}) {
  return $axios.get('/api/news', {
    params: {
      pageNum
    }
  })
    .then(({data}) => data.data)
}

export default {
  components: {Pagination},
  asyncData ({ $axios, query }) {
    return getNews($axios, query)
      .then((data) => ({
        news: data.news,
        totalCount: data.totalCount
      }))
  },
  data () {
    return {
      pageNum: 1
    }
  },
  methods: {
    getData () {
      const pageNum = this.pageNum
      getNews(this.$axios, {pageNum}).then(({news, totalCount}) => {
        this.news = news
        this.totalCount = totalCount
      })
    }
  },
  watch: {
    pageNum (pageNum) {
      this.$router.push({
        path: '/news',
        query: {
          ...this.$route.query,
          pageNum
        }
      })
    },
    '$route.query' () {
      this.pageNum = Number(this.$route.query.pageNum)
      this.getData()
    }
  }
}
</script>
<style scoped>
.news-ul{
  padding: 0 40px;
}
.news-li{
  border-bottom: 1px solid #ddd;
}
.title{
  margin: 12px 0;
}
.time {
  margin: 4px 0;
  font-size: 14px;
}
.detail {
  margin: 8px 0;
  font-size: 16px;
}
</style>

