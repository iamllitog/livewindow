export const platforms = [{
  name: 'douyu',
  chtext: '斗鱼'
}, {
  name: 'huomao',
  chtext: '火猫'
}, {
  name: 'xiongmao',
  chtext: '熊猫'
}, {
  name: 'quanmin',
  chtext: '全民'
}, {
  name: 'zhanqi',
  chtext: '战旗'
}, {
  name: 'longzhu',
  chtext: '龙珠'
}, {
  name: 'huya',
  chtext: '虎牙'
}]

export const mysqlConfig = {
  development: {
    user: 'root',
    host: 'bj-cdb-mmuzt5tx.sql.tencentcdb.com',
    port: 63329,
    password: 'Aa111111',
    database: 'livewindow',
    charset: 'utf8mb4'
  },
  production: {
    user: 'root',
    host: '172.21.0.17',
    port: 3306,
    password: 'Aa111111',
    database: 'livewindow',
    charset: 'utf8mb4'
  }
}

export const serverConfig = {
  development: {
    port: 8888
  },
  production: {
    port: 80
  }
}

export default {
  platforms,
  mysqlConfig,
  serverConfig
}
