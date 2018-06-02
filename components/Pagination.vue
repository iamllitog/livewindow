<template>
	<div class="pagination">
    <a href="javascript:void(0)"
      @click="goPrePage"
      class="pageChange shark-pager-prev"
      :class="{'shark-pager-disable shark-pager-disable-prev':currentPage <= 1}">
      上一页
    </a>
    <a href="javascript:void(0)"
      v-if="showPageStartIndex > 1"
      @click="beforeMoreClick()"
      class="pageChange shark-pager-item">
      {{beforeText}}
    </a>
    <a href="javascript:void(0)"
      class="pageChange shark-pager-item"
      @click="goPage(n+showPageStartIndex-1)"
      v-for="n in showPageLen"
      :class="{'current':currentPage === (n+showPageStartIndex-1)}">
      {{n+showPageStartIndex-1}}
    </a>
    <a href="javascript:void(0)"
      v-if="showPageStartIndex+maxPageLen-1 < pageLen"
      @click="afterMoreClick()"
      class="pageChange shark-pager-item">
      {{afterText}}
    </a>
    <a href="javascript:void(0)"
      @click="goNextPage"
      class="pageChange shark-pager-next"
      :class="{'shark-pager-disable shark-pager-disable-next': currentPage === pageLen}">
      下一页
    </a>
    <span class="jumppage">跳转到：</span><input v-model="pageInput" class="jumptxt" name="" type="text"><a @click="goPage(pageInput)" href="javascript:void(0)" class="pageChange shark-pager-submit">GO</a>
	</div>
</template>

<script>
// 分页组件

export default {
  model: {
    prop: 'currentPage',
    event: 'change'
  },
  props: {
    // 数据总条目数
    totalCount: {
      type: Number,
      required: true
    },
    // 每页个数
    prePageSize: {
      type: Number,
      default: 20
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      pageInput: '',
      maxPageLen: 5
    }
  },
  methods: {
    afterMoreClick () {
      let clickIndex = this.showPageStartIndex + this.maxPageLen
      if (clickIndex >= this.pageLen) {
        this.goPage(this.pageLen)
      } else {
        this.goPage(clickIndex)
      }
    },
    beforeMoreClick () {
      let clickIndex = this.showPageStartIndex - 1
      if (clickIndex < 1) {
        this.goPage(1)
      } else {
        this.goPage(clickIndex)
      }
    },
    /**
     * 翻到某一页
     *
     * @param      {Number}  pageIndex  The page index
     */
    goPage (pageIndex) {
      let pageNum = parseInt(pageIndex)
      if (isNaN(pageNum)) {
        alert('请输入正确页码')
        return
      }
      if (pageNum < 1 || pageNum > this.pageLen) {
        alert(`请输入1到${this.pageLen}范围内的页码`)
        return
      }
      this.$emit('change', pageNum)
    },
    /**
     * 翻到某一页,并强制获取数据
     *
     * @param      {Number}  pageIndex  The page index
     */
    getData (pageIndex) {
      if (this.currentPage === pageIndex) {
        this.$emit('on-page-change', pageIndex)
      } else {
        this.$emit('change', pageIndex)
      }
    },
    /**
     * 上一页
     */
    goPrePage () {
      if (this.currentPage > 1) {
        this.$emit('change', this.currentPage - 1)
      }
    },
    /**
     * 下一页
     */
    goNextPage () {
      if (this.currentPage < this.pageLen) {
        this.$emit('change', this.currentPage + 1)
      }
    }
  },
  watch: {
    currentPage (val) {
      this.$emit('on-page-change', val)
    }
  },
  computed: {
    showPageStartIndex () {
      let index = this.currentPage - Math.floor(this.maxPageLen / 2)
      if ((this.currentPage + Math.floor(this.maxPageLen / 2)) >= this.pageLen) {
        index = this.pageLen - this.maxPageLen + 1
      }
      if (index <= 0) {
        index = 1
      }
      return index
    },
    beforeText () {
      return this.showPageStartIndex <= 2 ? '1' : '...'
    },
    afterText () {
      return this.showPageStartIndex + this.maxPageLen < this.pageLen ? '...' : this.pageLen
    },
    showPageLen () {
      if (this.pageLen > this.maxPageLen) {
        return this.maxPageLen
      }
      return this.pageLen
    },
    pageLen () {
      let len = Math.ceil(this.totalCount / this.prePageSize)
      if (len === 0) len = 1
      if (this.currentPage > len) {
        this.$nextTick(() => {
          this.$emit('change', 1)
        })
      }
      return len
    }
  }
}
</script>
<style scoped>
.pagination {
    padding: 20px 0 30px;
    text-align: center;
    font-size: 12px;
}

.pagination a.shark-pager-disable {
    display: inline-block;
    height: 26px;
    text-align: center;
    line-height: 26px;
    color: #bfbfbf;
    margin: 0 5px;
    border: 1px solid #bfbfbf;
    border-radius: 3px;
}

.pagination a.shark-pager-disable:hover {
    border: 1px solid #bfbfbf;
    background: 0 0;
    cursor: text;
    color: #bfbfbf;
}

.pagination a.shark-pager-next, .pagination a.shark-pager-prev {
    width: 60px;
}

.pagination a {
    height: 26px;
    color: #7f7f7f;
    border: 1px solid #d5d5d5;
    border-radius: 3px;
}

.pagination a, .pagination a.current {
    width: 34px;
    text-align: center;
    line-height: 26px;
    margin: 0 5px;
    display: inline-block;
}

.pagination a.current {
    height: 26px;
    border-radius: 3px;
}

.pagination .jumppage {
    margin-left: 20px;
    color: #7f7f7f;
    line-height: 28px;
}

.pagination .jumptxt {
    width: 34px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d5d5d5;
    padding: 0 5px;
    vertical-align: top;
}

.pagination a.current, .pagination a:hover {
    background: #2d3e50;
    color: #fff;
    border: 1px solid #2d3e50;
}
</style>
