import mysqlUtil from '../util/mysqlUtil'
import { platforms } from '../config'

// 在reporttemp_author（字段：platform，author，timecount）表中找到 对应平台&今日 的数据
// 无此数据 新建此条数据
// 有此数据 更新timecount
const COLLECT_SQL = `INSERT INTO reporttemp_author (platform,author,timecount) SELECT platform,author,1 FROM allvideos ON DUPLICATE KEY UPDATE timecount=timecount+1;`
const DEL_COLLECT_SQL = `DELETE FROM reporttemp_author`
// 统计活跃主播数到report_authorNum(字段：platform，authorNum,collectDate)
const PLATFORM_ACTIVE_AUTHOR_SQL = `INSERT INTO report_authornum(platform,authorNum,collectDate) SELECT platform,COUNT(*),date_sub(curdate(),interval 1 day)
 FROM reporttemp_author GROUP BY platform;`

export default {
  collect () {
    return mysqlUtil.getConnection()
      .then((connection) => this.doSql(connection, COLLECT_SQL))
      .then(({connection, rows}) => {
        connection.release()
      })
  },
  timeTask () {
    return mysqlUtil.getConnection()
      .then((connection) => this.doSql(connection, PLATFORM_ACTIVE_AUTHOR_SQL))
      .then(({connection, rows}) => this.doSql(connection, DEL_COLLECT_SQL))
      .then(({connection, rows}) => {
        connection.release()
      })
  },
  getDayactiveanchor () {
    return mysqlUtil.getConnection()
      .then((connection) => this.doSql(connection, `SELECT DATE_FORMAT(collectDate,'%Y-%m-%d') AS collectDate FROM report_authornum GROUP BY collectDate ORDER BY collectDate;`))
      .then(({connection, rows}) => {
        let allPromise = []
        platforms.forEach((platform) => {
          allPromise.push(this.dayactiveanchor(connection, platform))
        })
        return Promise.all(allPromise)
          .then((datas) => {
            connection.release()
            return Promise.resolve({
              dates: rows,
              datas
            })
          })
      })
  },
  dayactiveanchor (connection, platform) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT authorNum FROM report_authornum WHERE platform=? ORDER BY collectDate`, [platform.name], function (error, rows) {
        if (error) { reject(error) } else {
          resolve({
            name: platform.name,
            chtext: platform.chtext,
            data: rows
          })
        }
      })
    })
  },
  doSql (connection, sql) {
    return new Promise((resolve, reject) => {
      connection.query(sql, [], function (error, rows) {
        if (error) { reject(error) } else {
          resolve({connection, rows})
        }
      })
    })
  }
}
