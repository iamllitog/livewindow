const mysqlUtil = require('../util/mysqlUtil');

// 在reporttemp_author（字段：platform，author，timecount）表中找到 对应平台&今日 的数据 
    // 无此数据 新建此条数据 
    // 有此数据 更新timecount
const COLLECT_SQL = `INSERT INTO reporttemp_author (platform,author,timecount) SELECT platform,author,1 FROM allvideos ON DUPLICATE KEY UPDATE timecount=timecount+1;`;
const DEL_COLLECT_SQL = `DELETE FROM reporttemp_author`;
// 统计活跃主播数到report_authorNum(字段：platform，authorNum,collectDate)
const PLATFORM_ACTIVE_AUTHOR_SQL = `INSERT INTO report_authornum(platform,authorNum,collectDate) SELECT platform,COUNT(*),date_sub(curdate(),interval 1 day)
 FROM reporttemp_author GROUP BY platform;`;

module.exports = {
    collect (){
        return mysqlUtil.getConnection()
        .then((connection) => {
            return this.doSql(connection,COLLECT_SQL);
        })
        .then(({connection,rows}) => {
            connection.release();
        });
    },
    timeTask (){
        return mysqlUtil.getConnection()
        .then((connection) => {
            return this.doSql(connection,PLATFORM_ACTIVE_AUTHOR_SQL);
        })
        .then(({connection,rows}) => {
            return this.doSql(connection,DEL_COLLECT_SQL);
        })
        .then(({connection,rows}) => {
            connection.release();
        });
        
    },
    doSql (connection,sql){
        return new Promise((resolve,reject) => {
            connection.query(sql,[],function(error,rows){
                if (error){reject(error)}
                else{
                    resolve({connection,rows});
                }
            });
        });
    }
};