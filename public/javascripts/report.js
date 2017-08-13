var reportApp = {
    chart : null,
    data : {
        reportType : '',
    },
    reportOptions : {
        // 日活跃主播
        dayactiveanchor : {
            title: {
                text: '日活跃主播',
                subtext : '各平台观看人数100以上日活跃主播'
            },
            tooltip: {
                trigger: 'axis',
            },
            dataZoom: [{
                start: 90,
                end: 100,
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
                data:[]
            },
            xAxis: {
                name: 'collectDate',
                type: 'time',
            },
            yAxis: {
                name: 'authorNum',
                type: 'value',
            },
            series: []
        }
    },
    init : function(){
        this.initData();
        this.initEvent();
        this.initView();
        this.initReport();
    },
    initData : function(){
        this.data.reportType = $('input[name=reportType]').val();
        var reportData = $.parseJSON($('input[name=reportData]').val());
        var legendData = [];
        var series = [];
        for (var index = 0; index < reportData.length; index++) {
            var report = reportData[index];
            legendData.push(report.chtext);
            series.push({
                name: report.chtext,
                type: 'line',
                showSymbol: false,
                data: report.rows
            });
        }
        this.reportOptions.dayactiveanchor.legend.data = legendData;
        this.reportOptions.dayactiveanchor.series = series;
    },
    initEvent : function(){
        window.onresize = function() {
            reportApp.chart.resize();
        };
    },
    initView : function(){
        this.chart = echarts.init(document.getElementById('chart'));        
    },
    initReport : function(){
        this.chart.setOption(this.reportOptions[this.data.reportType]);
    }
};

$(function(){
    reportApp.init();
});