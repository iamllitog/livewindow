var express = require('express');
var router = express.Router();
const statisticsAuthor = require('../statistics/author');

/* GET report page. */
router.get('/', function(req, res, next) {
    res.redirect('/report/dayactiveanchor');
});

router.get('/dayactiveanchor', function(req, res, next) {
    statisticsAuthor.getDayactiveanchor()
    .then((data) => {
        let reportData = {
            xAxis : null,
            data : null
        };
        reportData.xAxis = data.dates.map((item) => {
            return item.collectDate;
        });
        let xaxisLen = reportData.xAxis.length;
        reportData.data = data.datas.map((rows) => {
            rows.data = rows.data.map((item) => {
                return item.authorNum;
            });
            let unshiftLen = xaxisLen - rows.data.length;
            for (var index = 0; index < unshiftLen; index++) {
                rows.data.unshift(null);
            }
            return rows;
        });
        res.render('report',{
            keyword: '',
            currentTab : 'report',
            reportTab : 'dayactiveanchor',
            reportData : JSON.stringify(reportData)
        });
    });
    
});

module.exports = router;