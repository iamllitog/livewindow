var includeHeader = {
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
        $('#searchInput').bind('keypress',function(event){
             if(event.keyCode == "13"){
                var keyword = $(this).val();
                let params = MyUtil.query2Dict(window.location);
                delete params.pageNum;
                params.keyword = keyword;
                if ($.trim(keyword) === '') delete params.keyword;
                window.location.href="/?"+$.param(params); 
             }
         });
    },
    initView : function(){
        if ($('#searchInput').val() !== '')   $('#searchHint').hide();
    }
};


$(function(){
    includeHeader.init();
});