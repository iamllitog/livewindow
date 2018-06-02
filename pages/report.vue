<template>
  <div>
    <div class="menu">
      <div class="menu-content">
        <nuxt-link to="/report" class="menu-item" :class="{'active':reportTab === 'dayactiveanchor'}">日活跃主播</nuxt-link>
      </div>
    </div>
    <div class="content">
        <div class="chart" ref="chart"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'

// 获取报告数据
function getReportData ($axios) {
  return $axios.get('/api/report/dayactiveanchor')
    .then(({data}) => data.data)
}

let chart = null

// 获取报告选项
function getReportOptions (type) {
  switch (type) {
    case 'dayactiveanchor':
      return {
        title: {
          text: '日活跃主播',
          subtext: '各平台观看人数100以上日活跃主播'
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [{
          startValue: 0,
          endValue: 0,
          minValueSpan: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        legend: {
          data: []
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
    default:
      return {}
  }
}

export default {
  asyncData ({ $axios }) {
    return getReportData($axios)
      .then((data) => ({
        reportTab: data.reportTab,
        reportData: data.reportData
      }))
  },
  mounted () {
    this.$nextTick(() => {
      chart = echarts.init(this.$refs.chart)
      this.initReport()
    })
  },
  methods: {
    initReport () {
      switch (this.reportTab) {
        case 'dayactiveanchor':
          chart.setOption(this.getDayactiveanchorOptions())
          break
      }
    },
    getDayactiveanchorOptions () {
      let options = getReportOptions('dayactiveanchor')
      let reportData = this.reportData
      let legendData = []
      var series = []
      for (let index = 0; index < reportData.data.length; index++) {
        let report = reportData.data[index]
        legendData.push(report.chtext)
        series.push({
          name: report.chtext,
          type: 'line',
          showSymbol: false,
          data: report.data
        })
      }
      options.legend.data = legendData
      options.series = series
      options.xAxis.data = reportData.xAxis
      options.dataZoom[0].endValue = reportData.xAxis.length - 1
      options.dataZoom[0].startValue = (reportData.xAxis.length - 31) >= 0 ? (reportData.xAxis.length - 31) : 0
      return options
    }
  }
}
</script>
<style scoped>

.menu{
    position: fixed;
    width : 180px;
    height: 100%;
    top: 62px;
    background-color:rgb(37, 42, 58);
    z-index: 1;
}


.menu .menu-item{
    display: block;
    color: #999;
    border: none;
    white-space: normal;
    padding: 10px 16px;
}

.menu .menu-item:hover, .menu .menu-item:focus {
    background: #333;
}
.menu .menu-item.active{
    background: #1f8dd6;
    color: #ffffff;
}

.content{
  position: fixed;
  top: 62px;
  left: 180px;
  right: 0;
  padding: 40px 52px;
}

.chart{
    height: 500px;
}
</style>
