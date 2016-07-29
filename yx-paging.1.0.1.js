/**
 * Created by Ch on 16/5/23.
 */
(function(w,$){
    //默认参数
    var defaults = {
        //count : 200 总条数
        first : true,//是否开启首页
        last : true,//是否开启末页
        viewNumber : true, //是否启用每页多少条的选择功能
        current : 1,//当前页
        viewOpt : [10,20,50,100],//可供每页显示条数选择
        limit : 10,//默认每页条数
        jump : true, //是否显示页面跳转功能
        viewCount : true//是否显示共多少页
    };
    var htmlReload = {
        //html生成
        init : function(myThis){
            this.o = $.extend(true,{},myThis.o);
            var _o = this.o;
            var html = '';
            if(_o.first){
                html += '<a href="javascript:;" id="yxPagingFirst">首页</a>';
            }
            html += '<a href="javascript:;" id="yxPagingPrev">上一页</a><span  id="yxPagingBtns"></span><a href="javascript:;" id="yxPagingNext">下一页</a>';
            if(_o.last){
                html += '<a href="javascript:;" id="yxPagingLast">尾页</a>';
            }
            if(_o.viewNumber){
                var opts = "";
                for(var i = 0, ed = _o.limit, edStr='', len = _o.viewOpt.length,me; i < len; i++){
                    me = _o.viewOpt[i];
                    if(me === ed){
                        edStr = 'selected'
                    }else{
                        edStr = '';
                    }
                    opts += '<option value="'+ me +'"'+ edStr +'>' + me + '</option>';
                }
                html += '<span><label>每页显示</label><select id="yxPagingViewNum">' + opts + '</select><label>条</label></span>';
            }
            if(_o.jump){
                html += '<span><label>跳转到第</label><input type="text"  id="yxPagingJumpNum"/><label>页</label><button id="yxPagingJumpBtn">go</button></span>';
            }
            if(_o.viewCount){
                html += '<span id="yxPagingCount"></span>'
            }
            myThis.$target.html(html);
            myThis.$pages = myThis.$target.find("#yxPagingBtns");
            myThis.reloadcurrent()
        },
        //重新计算并渲染页标
        reloadPages : function (options,$pages) {

            var str = '',choose = '',i,len,pageCount = options.pageCount,current = options.current;

            $("#yxPagingCount").html("共" + pageCount + "页");
            if(current >= 10){
                i = current - 9;
            }else{
                i = 1;
            }
            len = i + 10;
            for(; i < len; i++){
                if(i == current){
                    choose = "class='yxPaging_choose'"
                }else{
                    choose = '';
                }
                str += '<a href="javascript:;" name="' + i + '" ' + choose + '>' + i + '</a>';
            }
            if(pageCount > 10 && current != pageCount-1 && current != pageCount){
                str += '<a href="javascript:;" class="yxPaging_more" name="more" index="'+ i +'">...</a>';
            }
            if(pageCount > 10 && current != pageCount){
                str += '<a href="javascript:;" name="' + pageCount + '">' + pageCount + '</a>';
            }
            $pages.html(str);
        }


    };
    //
    var operation = {
        init : function(myThis){
            this.o = $.extend(true,{},myThis.o);
            htmlReload.init(myThis);
            this.eventBind(myThis);
        }
        //事件绑定
        ,eventBind : function(myThis){
            var $myThis = $(myThis)
                ,_o = myThis.o
                ,eventFn = function(e,msg){
                    if(_o.callback){
                        _o.callback(msg);
                    }else{
                        myThis.reloadPages();
                    }
                }
                ,msg = {};
            $myThis.on("jump",eventFn).on("viewNum",eventFn);

            if(this.o.viewNumber){
                myThis.$target.on("change","#yxPagingViewNum",function(){//显示多少条
                    var $this = $(this),
                        val = $this.val();
                    _o.current = 1;
                    _o.limit = val;
                    msg ={
                        evnt : "viewNum"
                        ,type : "option"
                    };

                    $myThis.trigger("viewNum",[msg]);
                });
            }
            if(this.o.jump){
                myThis.$target.on("click","#yxPagingJumpBtn",function(){//输入页值跳转
                    var val = $("#yxPagingJumpNum").val();
                    _o.current = val || _o.current;
                    msg ={
                        evnt : "jump"
                        ,type : "target"
                    };
                    $myThis.trigger("jump",[msg]);
                });
            }
            myThis.$target.on("click","#yxPagingBtns a",function(){//点击页值跳转
                var $this = $(this),
                    val = $this.attr("name");
                if(val === "more"){
                    var index = $this.attr("index");
                    _o.current = index;
                    msg ={
                        evnt : "jump"
                        ,type : "more"
                    };
                    $myThis.trigger("jump",[msg]);
                }else{
                    _o.current = val;
                    msg ={
                        evnt : "jump"
                        ,type : "target"
                    };
                    $myThis.trigger("jump",[msg]);
                }
            }).on("click","#yxPagingFirst",function () {//首页
                _o.current = 1;
                msg ={
                    evnt : "jump"
                    ,type : "first"
                };
                $myThis.trigger("jump",[msg]);
            }).on("click","#yxPagingLast",function () {//末页
                _o.current = _o.pageCount;
                msg ={
                    evnt : "jump"
                    ,type : "last"
                };
                $myThis.trigger("jump",[msg]);
            }).on("click","#yxPagingNext",function () {//下一页
                _o.current++;
                if(_o.current > _o.pageCount){
                    _o.current = _o.pageCount
                }
                msg ={
                    evnt : "jump"
                    ,type : "next"
                };
                $myThis.trigger("jump",[msg]);

            }).on("click","#yxPagingPrev",function () {//上一页
                _o.current--;
                if(_o.current <= 0 ){
                    _o.current = 1
                }
                msg ={
                    evnt : "jump"
                    ,type : "prev"
                };
                $myThis.trigger("jump",[msg]);

            });

        }
    };

    var YxPaging = function(target,options){
        this.$target = $(target);
        this.o = $.extend(true,defaults,options);
        operation.init(this);
    };
    YxPaging.prototype = {
        //参数设置接口
        set : function(options){
            $.extend(true,this.o,options);
        },
        //获取参数
        get : function (str) {
            return this.o[str];
        },
        //重新计算多少页
        reloadPages : function(){
            var _o = this.o;
            _o.pageCount = Math.ceil(_o.count / _o.limit);
            if(_o.current > _o.pageCount){
                _o.current = _o.pageCount;
            }
            htmlReload.reloadPages(_o,this.$pages);
        }
    };

    w.YxPaging = w.YxPaging || YxPaging;
})(window,$);