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
        res.render('report',{
            keyword: '',
            currentTab : 'report',
            reportTab : 'dayactiveanchor',
            reportData : JSON.stringify(data)
        });
    });
    
});

module.exports = router;