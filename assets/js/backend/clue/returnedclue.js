define(['jquery', 'bootstrap', 'backend', 'table', 'form','template'], function ($, undefined, Backend, Table, Form,Template) {

    var Controller = {

        returnedclue:function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/returnedClue',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        //复选框
                        {field: 'state', checkbox: true},
                        //默认隐藏该列
                        {field: 'id', title: "线索ID",  operate: '=', align: 'left', style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式",operate: '=', align: 'left', events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone, style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left' ,style: 'width:120px;'},
                        {field: 'way_source', title: "线索来源",operate: '=', align: 'left',searchList: $.getJSON('/Ajax/getWaySourceListForSearch') },
                        {field: 'org_sign', title: "所属组织",operate: false, align: 'left'},
                        {field: 'status_name', title: "线索状态",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getStatusNameForSearch') },
                        {field: 'flow_state_id', title: "跟进状态",operate: '=', align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch')},
                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: "LIKE", align: 'left' ,style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: "LIKE", align: 'left' ,style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",visible: false,operate: false, align: 'left' },
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },

                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
                                 detail+= '<a class="btn btn-xs btn-success btn-get">领取</a> ';

                            return detail + Table.api.formatter.operate.call(this, value, row, index, table);
                        }}

                        //只显示在搜索列表中
                        // {field: 'account', title: "账号",visible: false, align: 'left' },


                    ],
                ],
                //禁用默认搜索
                search: false,
                //启用普通表单搜索
                commonSearch: true,
                //可以控制是否默认显示搜索单表,false则隐藏,默认为false
                searchFormVisible: true,
                showToggle: false,
                exportDataType: "basic",
                fixedColumns: false,//固定列
                fixedNumber:4,//固定前两列
            });

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                $("button[name='commonSearch']").hide();
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            // 分配线索
            $(document).on("click", ".btn-allocation", function () {
                var that = this;
                var selected = table.bootstrapTable('getSelections');
                var aa=selected[0].id;
                var ids = new Array();
                for(var i=0;i<selected.length;i++) {
                    ids[i] = selected[i].id;
                }
                Layer.open({
                    content: Template("allocationtpl", {}),
                    area: ['560px', '350px'],
                    title: __('请选择坐席人员'),
                    resize: false,
                    btn: [__('确定'), __('取消')],
                    yes: function (index, layero) {
                        var params={};
                        params.ids=ids;
                        params.ower_id=$("#ower", layero).val();
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: '/Clue/allocationClue',
                            data: params,
                            success: function (ret) {
                                Layer.closeAll();
                                Layer.alert(ret.msg);
                                $("#table").bootstrapTable('refresh');
                            }
                        });
                    },
                    btn2: function () {
                        Layer.closeAll();
                        return false;
                    },
                    success: function (layero, index) {
                        //  $(".layui-layer-btn1", layero).prop("href", "http://www.fastadmin.net/user/register.html").prop("target", "_blank");
                        $("#ower").empty();
                        $.getJSON('/ajax/getUserByOrgId?org_id=1',function(ret){
                            if(ret.code==1){
                                var option="";
                                $(ret.data).each(function(k,v){
                                    option+='<option value="'+v.id+'">'+v.name+'</option>';
                                })
                                $("#ower").append(option)
                            }
                        });
                    }
                });

            });
            $(document).on("change","select[name=\"row[org_id]\"]",function(){
                var id= $(this).val();
                $("#ower").empty();
                $.getJSON('/ajax/getUserByOrgId?org_id='+id,function(ret){
                    if(ret.code==1){
                        var option="";
                        $(ret.data).each(function(k,v){
                            option+='<option value="'+v.id+'">'+v.name+'</option>';
                        })
                        $("#ower").append(option)
                    }
                });
            })
        },
        add: function () {
            Form.api.bindevent($("form[role=form]"));
            Controller.api.bindevent();
        },

        detailApi: {
            events: {//绑定事件的方法
                operate: $.extend({
                    'click .btn-detail': function (e, value, row, index) {
                        e.stopPropagation();
                        openUrl = '/clue/detail?id=' + row.id;
                        //Backend.api.open(openUrl, "线索详情");
                        //弹出即全屏
                        var loading = layer.load(1, {
                            shade: [0.1,'#fff'] //0.1透明度的白色背景
                        });
                        var area = [$(window).width() > 800 ? '800px' : '95%', $(window).height() > 600 ? '600px' : '95%'];
                        var index = layer.open({
                            type: 2,
                            content: openUrl,
                            area: area,
                            title: '线索详情',
                            maxmin: true
                        });
                        layer.full(index);
                        layer.close(loading);
                    },
                    'click .btn-get': function (e, value, row, index) {
                        e.preventDefault();
                        tip = '您确定要领取此线索吗?';
                        conLayer = layer.confirm(tip, {
                            title : '线索领取',
                            btn: ['确定','取消'] //按钮
                        }, function(){
                            layer.close(conLayer);
                            params = {};
                            params.id = row.id;
                            Backend.api.ajax({url: "/clue/getClue",data:params}, function(){
                                $("#table").bootstrapTable('refresh');
                            });//操作成功后刷新页面
                        }, function(){
                            //取消后的操作
                        });

                    }

                }, Table.api.events.operate)
            }
        },
        api: {
            //页面数据渲染方式
            formatter : {
                phone: function (value, row, index) {
                    //这里手动构造URL
                    url = "/clue/detail?id="+ row.id;
                    //res = '<a href="' + url + '" class="addtabsit bg-success" title="' + value + '">' + value + '</a>';
                    res = '<a href="javascript:;" class="bg-success btn-detail" title="' + value + '">' + value + '</a>';
                    return res;
                },
                platform: function (value, row, index) {
                    //格式化平台
                    var platformArr=new Array()
                    platformArr[0]="其他"
                    platformArr[1]="WEB"
                    platformArr[2]="H5"
                    platformArr[3]="M站"
                    platformArr[4]="Android"
                    platformArr[5]="IOS"
                    platformArr[6]="小程序"
                    platformArr[7]="其他APP"

                    var  res = platformArr[value];
                    return res;
                },
            },
            bindevent:function(){
                // $(document).on("change","select[name=\"row[org_id]\"]",function(){
                //     var id= $(this).val();
                //    $("#roles").empty();
                //     $.getJSON('/ajax/getRole?org_id='+id,function(ret){
                //         if(ret.code==1){
                //             var option="";
                //             $(ret.data).each(function(k,v){
                //                 option+='<option value="'+v.id+'">'+v.name+'</option>';
                //             })
                //            $("#roles").append(option)
                //         }
                //     });
                // })
            }




        },



    };

    return Controller;

});