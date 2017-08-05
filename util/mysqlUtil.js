var mysql = require('mysql');

//创建连接池
var pool  = mysql.createPool({
    user : 'root',
    host : 'localhost',
    port : 3306,
    password : 'Aa111111',
    database : 'livewindow',
    charset : 'utf8mb4'
});

var platforms = require('../config').platforms;

module.exports = {
    getLives ({keyword,pageNum,pageCount,category,platform}){
        platform = platforms.find(function(val){return val.name === platform});
        if (!platform)  platform = 'allvideos';
        else platform = platform.name;
        return Promise.all([this.getLivesList({keyword,pageNum,pageCount,category,platform}),this.getLivesCount({keyword,category,platform})])
        .then(([livesRows,countRows]) => {
            return {
                lives : livesRows,
                totalCount : countRows[0].count
            };
        });
    },
    getLivesList ({keyword,pageNum,pageCount,category,platform}){
        if (isNaN(pageNum) || isNaN(pageCount)){
            return Promise.reject('pageNum,pageCount参数需要是数字');
        }
        let offset = (pageNum - 1) * pageCount;
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`SELECT * FROM ${platform} WHERE category LIKE ? AND (title LIKE ? OR author LIKE ?) ORDER BY personNum DESC LIMIT ${offset},${pageCount}`,[`%${category}%`,`%${keyword}%`,`%${keyword}%`],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
    getLivesCount ({keyword,category,platform}){
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`SELECT count(*) AS count FROM ${platform} WHERE category LIKE ? AND (title LIKE ? OR author LIKE ?)`,[`%${category}%`,`%${keyword}%`,`%${keyword}%`],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
    getCategory (count){
        if (!count) count = 5;
        if (isNaN(count)){
            return Promise.reject('pageNum,pageCount参数需要是数字');
        }
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`SELECT category,count( * ) AS count FROM allvideos GROUP BY category ORDER BY count DESC LIMIT ${count}`,[],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
    deleteDataByPlatform (platform){
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`DELETE FROM ${platform}`,[],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
    deleteDataLtViewCount (platform,viewcount){
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`DELETE FROM ${platform} WHERE personNum < ?`,[viewcount],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
    deleteDataByCategoryAndPlatform (platform,category){
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`DELETE FROM ${platform} WHERE category=?`,[category],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
    insertDataByPlatform (platform,data){
        data = data.map(function(item) {
            return [item.title,item.url,item.imageUrl,item.author,item.personNum,item.category,item.platform];
        });
        if (data.length === 0){
            return Promise.resolve();
        }
        return new Promise((resolve,reject) => {
            pool.getConnection(function(err,connection) {
                if (err){reject(err)}
                else {
                    connection.query(`INSERT INTO ${platform}(title,url,imageUrl,author,personNum,category,platform) VALUES ?`,[data],function(error,rows){
                        if (error){reject(error)}
                        else{
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        });
    },
};