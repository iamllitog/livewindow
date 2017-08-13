var express = require('express');
var router = express.Router();

var homeRouter = require('./home');
var reportRouter = require('./report');

/* GET home page. */
router.use('/', homeRouter);

/* GET report page. */
router.use('/report', reportRouter);

module.exports = router;
