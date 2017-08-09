var authorNum = require('./authorNum');

module.exports = {
    collect (){
        return authorNum.collect()
        .catch((err) => {
            console.error(err);
        })
        .then((data) => {
            console.log('数据收集完成');
        });
    }
};