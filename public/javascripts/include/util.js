var MyUtil = {
    query2Dict : function (param) {
        var pattern = /([^?&=]+)=([^&#]*)/g;
        var dict = {};
        var search = null;
        if (typeof param === "object" && param instanceof Location) {
            search = param.search;
        }
        else if (typeof param === "string") {
            search = param;
        }
        else {
            throw new Error("参数类型非法！请传入window.loaction对象或者url字符串。");
        }
        search.replace(pattern, function (rs, $1, $2) {
            var key = decodeURIComponent($1);
            var value = decodeURIComponent($2);
            dict[key] = value;
            return rs;
        });
        return dict;
    }
};