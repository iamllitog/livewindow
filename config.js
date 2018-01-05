module.exports = {
    platforms : [{
        name : 'douyu',
        chtext : '斗鱼'
    },{
        name : 'huomao',
        chtext : '火猫'
    },{
        name : 'xiongmao',
        chtext : '熊猫'
    },{
        name : 'quanmin',
        chtext : '全民'
    },{
        name : 'zhanqi',
        chtext : '战旗'
    },{
        name : 'longzhu',
        chtext : '龙珠'
    },{
        name : 'huya',
        chtext : '虎牙'
    }],
    mysqlConfig : {
        dev : {
            user : 'root',
            host : 'localhost',
            port : 3306,
            password : 'Aa111111',
            database : 'livewindow',
            charset : 'utf8mb4'
        },
        prod : {
            user : 'root',
            host : '172.21.0.17',
            port : 3306,
            password : 'Aa111111',
            database : 'livewindow',
            charset : 'utf8mb4'
        }
    },
    serverConfig : {
        dev : {
            port : 8888
        },
        prod : {
            port : 8080
        }
    }
};