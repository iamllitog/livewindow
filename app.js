var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var index = require('./routes/index');
var searchEngin = require('./searchengin');
var statistics = require('./statistics');

/**
 * 爬虫任务 + 爬虫后日志分析
 * 
 */
function timer(){
  searchEngin()
  .then(() => {
    return statistics.collect();
  })
  .then(() => {
    setTimeout(() => {
        timer();
    },60*1000*10);
  });
}
// timer();

/**
 * 分析定时任务
 */
var statisticsSchedule = schedule.scheduleJob('0 10 0 * * *', function(){
  statistics.timeTask();
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
