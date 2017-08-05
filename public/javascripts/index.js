var app = {
    init : function(){
        this.initEvent();
        this.initView();
    },
    initEvent : function(){
        $('#searchHint').click(function(){
            $('#searchInput').focus();
        });
        $('#searchInput').focus(function(){
            $('#searchHint').hide();
        }).blur(function(){
            if ($(this).val() === '')   $('#searchHint').show();
        });
        $('.filter-info .dropdown').hover(function(){
            $(this).find('.droplist').show();
        },function(){
            $(this).find('.droplist').hide();
        });
        $(window).resize(function() {
            var contentBox = $('#live-list-contentbox');
            var contextWidth = contentBox.width();
            var classNum = parseInt(contextWidth / 330)+1;
            if (classNum > 10) classNum = 10;
            var className = 'x' + classNum;

            for (var i = 1; i<=10; i++) {
                contentBox.removeClass('x'+i);
            }
            contentBox.addClass(className);
        });
        $('.pageChange').click(function(){
            if ($(this).hasClass("shark-pager-disable"))    return;
            if ($(this).hasClass("current"))    return;
            var pageNum = parseInt($(this).attr("data-page"));
            if (isNaN(pageNum)){
                alert('页码必须是数字');
                return;
            }
            if (pageNum < 1){
                alert('页码不能小于1');
                return;
            }
            let params = MyUtil.query2Dict(window.location);
            params.pageNum = pageNum;
            window.location.href="?"+$.param(params); 
        });
        $('.categoryChange').click(function(){
            var category = $(this).attr("data-category");
            let params = MyUtil.query2Dict(window.location);
            delete params.pageNum;
            params.category = category;
            if ($.trim(category) === '') delete params.category;
            window.location.href="?"+$.param(params); 
        });
        $('.platformChange').click(function(){
            var platform = $(this).attr("data-platform");
            let params = MyUtil.query2Dict(window.location);
            delete params.pageNum;
            params.platform = platform;
            if ($.trim(platform) === '') delete params.platform;
            window.location.href="?"+$.param(params); 
        });
        $('#pageJumpInput').bind('input porpertychange',function(){
            $('#pageJumpBt').attr("data-page",$(this).val());
        });
        $('#searchInput').bind('keypress',function(event){
             if(event.keyCode == "13"){
                var keyword = $(this).val();
                let params = MyUtil.query2Dict(window.location);
                delete params.pageNum;
                params.keyword = keyword;
                if ($.trim(keyword) === '') delete params.keyword;
                window.location.href="?"+$.param(params); 
             }
         });
    },
    initView : function(){
        $(window).resize();
        if ($('#searchInput').val() !== '')   $('#searchHint').hide();
    }
};

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

$(function(){
    app.init();
});