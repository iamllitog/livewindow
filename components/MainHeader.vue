<template>
    <div>
        <div class="header">
            <div class="home-menu pure-menu pure-menu-horizontal clearfix">
            <a class="pure-menu-heading" href="/">Live Window</a>
            <ul class="pure-menu-list">
                <li :class="{'pure-menu-selected': path === '/'}" class="pure-menu-item"><nuxt-link to="/" class="pure-menu-link">首页</nuxt-link></li>
                <li :class="{'pure-menu-selected': path === '/report'}" class="pure-menu-item"><nuxt-link to="/report" class="pure-menu-link">数据分析</nuxt-link></li>
                <li class="pure-menu-item"><a href="javascript:void(0)" @click="payModal = !payModal" class="pure-menu-link">打赏站长</a></li>
            </ul>
            <div class="search-info">
                <span class="parent">
                <input type="text" class="txt j-flag" ref="searchInput" @focus="hideHint" @blur="inputBlur" @keyup.enter="search" v-model="keyword" style="opacity: 1;">
                <label class="ph j-flag" v-show="!isHideHint" @click="focusSearchInput">直播标题/主播名</label>
                </span>
            </div>
            </div>
        </div>

        <Modal v-model="payModal">
          <div class="make-money-modal">
            <h2>感谢您的支持，我会继续努力的！</h2>
            <img class="qr-img" src="@/assets/images/zhifubao_qr.png" alt="">
            <p class="tip">打开支付宝扫一扫,就可进行扫码打赏哦~</p>
          </div>
        </Modal>
    </div>
</template>

<script>
import Modal from './Modal'
export default {
  components: {Modal},
  data () {
    let keyword = this.$route.query.keyword
    return {
      path: this.$route.path,
      payModal: false,
      isHideHint: keyword && keyword !== '',
      keyword
    }
  },
  methods: {
    // 隐藏搜索提示
    focusSearchInput () {
      this.$refs.searchInput.focus()
    },
    // 隐藏hint
    hideHint () {
      this.isHideHint = true
    },
    // 输入框失去焦点触发
    inputBlur () {
      if (!this.keyword || this.keyword === '') this.isHideHint = false
    },
    // 搜索直播
    search () {
      let query = {...this.$route.query}
      delete query.pageNum
      query.keyword = this.keyword
      if (this.keyword.trim() === '') delete query.keyword
      query.pageNum = 1
      this.$router.push({
        path: '/',
        query
      })
    }
  }
}
</script>


<style scoped>
.make-money-modal{
  padding: 16px;
}
.home-menu {
    background: #2d3e50;
}
.home-menu {
    padding: 0.5em;
    box-shadow: 0 1px 1px rgba(0,0,0, 0.10);
}
.home-menu .pure-menu-heading {
    color: white;
    font-weight: 400;
    font-size: 120%;
}

.home-menu ul {
    float: right;
}

.home-menu a {
    color: #6FBEF3;
}

.home-menu .pure-menu-selected a,.home-menu .pure-menu-selected a:visited {
    color: white;
}

.home-menu li a:hover, .home-menu li a:focus {
    background: none;
    border: none;
    color: #AECFE5;
}

.search-info{
    font-size: 12px;
    margin: 6px 20px 0 0;
    width: 210px;
    height: 31px;
    float: right;
    background: url(~/assets/images/searchbar.png) no-repeat;
}

.search-info .parent {
    display: block;
    position: relative;
    margin: 2px 0 0 33px;
}
.search-info .parent input {
    width: 90%;
    margin: 0;
    padding: 0;
    background: transparent;
    color: #333;
    border: 0;
}
.search-info .parent input:focus {
    outline: none;
}

.search-info .parent label {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    color: #9b9b9b;
    cursor: text;
}

.zhifuqr .qr-img{
    max-width: 100%;
}
</style>
