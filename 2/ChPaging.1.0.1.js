/**
 * Created by Ch on 16/5/23.
 @Name : ChPaging v3.8.5 分页插件
 @Author: Ch/chenhui
 @Date: 2016/5/23
 @QQ：894684604
 @官网： https://cwlch.github.io/Ch_Paging/index.html
 *
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.ChPaging = factory());
}(this, (function () {
    'use strict';
    //默认参数
    var defaults = {
        first : true,//是否开启首页
        last : true,//是否开启末页
        viewNumber : true, //是否启用每页多少条的选择功能
        current : 1,//当前页
        viewOpt : [10,20,50,100],//可供每页显示条数选择
        limit : 10,//默认每页条数
        jump : true, //是否显示页面跳转功能
        viewCountPage : true,//是否显示共多少页
        viewCountNumber : true,//是否显示共多少条
        classPrefix : 'Ch',
        txtConfig : {
            first : '首页',
            last : '尾页',
            next : '下一页',
            prev : '上一页',
            jumpBtn : 'go',
            jumpTxt : '跳转到{n}页',
            countPage : "共{n}页",
            countNumber : '共{n}条',
            viewNumber : '每页显示{n}条'
        }
    };
    var htmlReload = {
        //html初始化
        init : function(myThis){
            // this.o = $.extend(true,{},myThis.o);
            var _o = myThis.o;
            var html = '';
            if(_o.first){
                html += '<a href="javascript:;" id="ChPagingFirst" class="'+_o.classPrefix+'_paging_first">'+_o.txtConfig.first+'</a>';
            }
            html += '<a href="javascript:;" id="ChPagingPrev" class="'+_o.classPrefix+'_paging_prev">'+_o.txtConfig.prev+'</a><span  id="ChPagingBtns" class="'+_o.classPrefix+'_paging_btn"></span><a href="javascript:;" id="ChPagingNext" class="'+_o.classPrefix+'_paging_next">'+_o.txtConfig.next+'</a>';
            if(_o.last){
                html += '<a href="javascript:;" id="ChPagingLast" class="'+_o.classPrefix+'_paging_last">'+_o.txtConfig.last+'</a>';
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
                html += '<span class="'+_o.classPrefix+'_paging_view_number"><label>'+ _o.txtConfig.viewNumber.replace(/^(.+)\{n\}(.+)$/,"$1")+'</label><select id="ChPagingViewNum">' + opts + '</select><label>'+ _o.txtConfig.viewNumber.replace(/^(.+)\{n\}(.+)$/,"$2")+'</label></span>';
            }
            if(_o.jump){
                html += '<span class="'+_o.classPrefix+'_paging_jump"><label>'+_o.txtConfig.jumpTxt.replace(/^(.+)\{n\}(.+)$/,"$1")+'</label><input type="text"  id="ChPagingJumpNum"/><label>'+_o.txtConfig.jumpTxt.replace(/^(.+)\{n\}(.+)$/,"$2")+'</label><button id="ChPagingJumpBtn">go</button></span>';
            }
            if(_o.viewCountPage){
                html += '<span id="ChPagingCount" class="'+_o.classPrefix+'_paging_count_page"></span>'
            }
            if(_o.viewCountNumber){
                html += '<span id="ChPagingCountNumber" class="'+_o.classPrefix+'_paging_count_number"></span>'
            }
            myThis.$target.html(html);
            myThis.$pages = myThis.$target.find("#ChPagingBtns");
            // myThis.reloadPages();
        },
        //重新计算并渲染页标
        reloadPages : function (options,$pages,$target) {

            var str = '',choose = '',i,len,indexLen,pageCount = options.pageCount,current = options.current;


            $target.find("#ChPagingCount").html(options.txtConfig.countPage.replace(/^(.+)\{n\}(.+)$/,"$1") + pageCount + options.txtConfig.countPage.replace(/^(.+)\{n\}(.+)$/,"$2"));
            $target.find("#ChPagingCountNumber").html(options.txtConfig.countNumber.replace(/^(.+)\{n\}(.+)$/,"$1") + options.count + options.txtConfig.countNumber.replace(/^(.+)\{n\}(.+)$/,"$2"));

            if(pageCount > 10){
                indexLen = 8;
            }else{
                indexLen = 10;
            }

            if(current >= 9){
                i = current - 7;
                if(current == pageCount ){
                    i = current - 9;
                    indexLen = 10
                }else if(current == (pageCount-1) ){
                    i = current - 8;
                    indexLen = 9;
                }
            }else{
                i = 1;
            }
            len = i + indexLen;
            if(pageCount < 10){
                len = pageCount + 1;
            }

            for(; i < len; i++){
                if(i == current){
                    choose = "class='"+options.classPrefix+"_Paging_choose'"
                }else{
                    choose = '';
                }
                str += '<a href="javascript:;" name="' + i + '" ' + choose + '>' + i + '</a>';
            }
            if(pageCount > 10 && current != pageCount-1 && current != pageCount){
                str += '<a href="javascript:;" class="'+options.classPrefix+'_Paging_more" name="more" index="'+ i +'">...</a>';
            }
            if(pageCount > 10 && current != pageCount){
                str += '<a href="javascript:;" name="' + pageCount + '">' + pageCount + '</a>';
            }
            $pages.html(str);
        }


    };
    //
    var operation = {
        //初始化
        init : function(myThis){
            // this.o = $.extend(true,{},myThis.o);
            var _o = myThis.o;

            myThis.static.start = 1;
            if(_o.xhr){//动态分页
                this.xhrReload(myThis);
            }else{//静态数据
                _o.count = _o.data.length;
                // myThis.static.start = 1;
                myThis.static.end = _o.limit;

                htmlReload.init(myThis);
                this.reloadListCbk(myThis);
            }
            // this.ready(myThis);
            //事件绑定
            this.eventBind(myThis);
        }
        //准备开始
        ,operationReady : function (myThis,m) {
            var _o = myThis.o
                ,msg = m || {
                    evnt : "default"
                    ,type : "default"
                };

            //计算并保存当前开始值和结束值
            myThis.static.end = _o.current * _o.limit;
            myThis.static.end = (_o.count) ? (myThis.static.end <= _o.count) ? myThis.static.end : _o.count : _o.limit;
            myThis.static.start = myThis.static.end - _o.limit + 1;


            msg.start = myThis.static.start;
            msg.end = myThis.static.end;
            if(_o.count){
                msg.count = _o.count;
            }
            if(_o.current){
                msg.current = _o.current;
            }
            if(_o.limit){
                msg.limit = _o.limit;
            }

            if(_o.operReady){
                _o.operReady(msg);
            }


            // if(m){//操作分页
            if(_o.xhr){
                this.xhrReload(myThis,msg);
            }else{
                this.reloadListCbk(myThis,msg);
            }
            // }
        }
        //发送ajax请求
        ,xhrReload : function (myThis,msg) {
            var _this = this,_o = myThis.o;
            $.ajax(_o.xhr).then(function (res) {
                var dataObj = _o.xhrSuccess(res);//格式化数据 data,count
                _o.data = dataObj.data;
                _o.count = dataObj.count;

                if(!msg){//判断如果是初始化则执行初始渲染
                    htmlReload.init(myThis);
                }
                _this.reloadListCbk(myThis,msg)
            });
        }
        //关联列表渲染
        ,reloadListCbk : function (myThis,m) {
            var _o = myThis.o
                ,data;

            myThis.reloadPages();


            //如果走的静态数据则取出前页需要展示的数据
            if(!_o.xhr){
                data = [];
                for(var i = myThis.static.start; i < myThis.static.end; i++){
                    data.push(_o.data[i]);
                }

            }else{
                data = _o.data;
            }
            //调用具体渲染当前页的回调函数
            if(_o.operFinsh){
                _o.operFinsh(data);
            }
        }
        //事件绑定
        ,eventBind : function(myThis){
            var $myThis = $(myThis)
                ,_this = this
                ,_o = myThis.o
                ,eventFn = function(e,msg){
                _this.operationReady(myThis,msg)
            }
                ,msg = {};
            $myThis.on("jump",eventFn).on("viewNum",eventFn);

            if(_o.viewNumber){
                myThis.$target.on("change","#ChPagingViewNum",function(){//显示多少条
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
            if(_o.jump){
                myThis.$target.on("click","#ChPagingJumpBtn",function(){//输入页值跳转
                    var val = $("#ChPagingJumpNum").val();
                    _o.current = val || _o.current;
                    msg ={
                        evnt : "jump"
                        ,type : "target"
                    };
                    $myThis.trigger("jump",[msg]);
                });
            }
            myThis.$target.on("click","#ChPagingBtns a",function(){//点击页值跳转
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
            }).on("click","#ChPagingFirst",function () {//首页
                _o.current = 1;
                msg ={
                    evnt : "jump"
                    ,type : "first"
                };
                $myThis.trigger("jump",[msg]);
            }).on("click","#ChPagingLast",function () {//末页
                _o.current = _o.pageCount;
                msg ={
                    evnt : "jump"
                    ,type : "last"
                };
                $myThis.trigger("jump",[msg]);
            }).on("click","#ChPagingNext",function () {//下一页
                _o.current++;
                if(_o.current > _o.pageCount){
                    _o.current = _o.pageCount
                }
                msg ={
                    evnt : "jump"
                    ,type : "next"
                };
                $myThis.trigger("jump",[msg]);

            }).on("click","#ChPagingPrev",function () {//上一页
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

    var ChPaging = function(target,options){
        this.$target = $(target);
        this.o = $.extend(true,{},defaults,options);
        this.static = {};
        operation.init(this);
    };
    ChPaging.prototype = {

        //参数设置接口
        set : function(options){
            $.extend(true,this.o,options);
        },
        //获取参数
        get : function (str) {
            return this.o[str] || this.static[str];
        },
        //重新计算多少页
        reloadPages : function(){
            var _o = this.o;
            _o.pageCount = Math.ceil(_o.count / _o.limit);
            if(_o.current > _o.pageCount){
                _o.current = _o.pageCount;
            }
            htmlReload.reloadPages(_o,this.$pages,this.$target);
        }
    };

    return ChPaging;
})));