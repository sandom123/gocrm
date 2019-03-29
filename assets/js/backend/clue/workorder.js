define(['jquery', 'bootstrap', 'backend', 'table', 'form','backend/clue/detail'], function ($, undefined, Backend, Table, Form, ClueDetail) {

    var Controller = {
        //派工单
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/ajax/getSellerList',
                },

            });
            var table = $("#table");
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        //复选框
                        {field: 'state', radio: true},
                        {field: 'id', title: '商家ID', operate: false, align: 'left'},
                        {field: 'store_name', title: '商家名称',operate: false},
                        {field: 'contacts', title: '联系人',operate: false},
                        {field: 'store_mobile', title: '联系方式',operate: false},
                        {field: 'city', title: '城市',operate:false},
                        {field: 'category_name', title: '品类',operate:false},
                        {field: 'mode', title: '分成模式', operate:false},
                    ]
                ],
                //禁用默认搜索
                search: false,
                //启用普通表单搜索
                commonSearch: false,
                //可以控制是否默认显示搜索单表,false则隐藏,默认为false
                searchFormVisible: true,
                showToggle: false,
                selectItemName:"row[store_id]",

            });

            /**
             * 自定义搜索按钮
             */
            $(".btn-searchSeller").on('click', function(){
                var params = table.bootstrapTable('getOptions');
                console.log(params);
                params.queryParams = function(params){
                    params.clue_id = CLUE_ID;
                    params.keywords = $.trim($(".searchSellerKeywords").val());
                    params.city_code = $(".searchSellerCity").val();
                    params.category_id = $(".searchSellerCategory").val();

                    return params;
                }

                table.bootstrapTable('refresh', params);
            });

            /**
             *派单按钮
             */
            $(".addWorkerOrder").on('click', function (e) {
                e.preventDefault();
                params = {row:{}};
                params.clue_id = CLUE_ID;
                params.row.reach_time = $("input[name='row[reach_time]']").val();
                params.row.is_reached = $("select[name='row[is_reached]']").val();

                if(!params.row.reach_time){
                    Toastr.error("请确定到店时间");
                    return false;
                }

                /**
                 * 获取所选择的商家
                 */
                var selectContent = table.bootstrapTable('getSelections')[0];
                if(typeof(selectContent) == 'undefined') {
                    Toastr.error("请选择商家");
                    return false;
                }else{
                    params.row.store_id = selectContent.id;
                }
                Controller.action.distributeWorkerOrder(params)
            });

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                $(".fixed-table-toolbar").remove();
            });
            // 为表格绑定事件
            Table.api.bindevent(table);
            Form.api.bindevent($("form[role=form]"));
        },
        add: function () {
            Form.api.bindevent($("form[role=form]"));
        },

        list: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/workorder/list',
                },

            });
            var table = $("#table");
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        //复选框
                        {field: 'state', checkbox: true},
                        {field: 'work_order_sn', title: '工单号', operate: '=', align: 'left',events: Controller.detailApi.events.operate,formatter: Controller.api.formatter.gotoClue},
                        {field: 'create_by', title: '派单人',operate: '=', searchList: $.getJSON('/Ajax/getOwerListForSearch')},
                        {field: 'create_time', title: '派单时间',operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"'},
                        {field: 'store_name', title: '商家名称',operate: 'LIKE'},
                        {field: 'name', title: '客户姓名',operate:'LIKE'},
                        {field: 'phone', title: '客户手机号',operate:'=',events: Controller.detailApi.events.operate,formatter: Controller.api.formatter.gotoClue},
                        {field: 'is_reached', title: '是否到店', operate:'=', searchList: {1:"已到店",2:"未到店"}},
                        {field: 'reach_time', title: '到店时间', operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"'},
                    ]
                ],
                //禁用默认搜索
                search: false,
                //启用普通表单搜索
                commonSearch: true,
                //可以控制是否默认显示搜索单表,false则隐藏,默认为false
                searchFormVisible: true,
                showToggle: false,
                exportDataType: "basic"
            });
            // 为表格绑定事件
            Table.api.bindevent(table);
            Form.api.bindevent($("form[role=form]"));
        },
        detailApi: {
            events: {//绑定事件的方法
                operate: $.extend({
                    'click .btn-detail': function (e, value, row, index) {
                        e.stopPropagation();
                        openUrl = '/clue/detail?id=' + row.clue_id;
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
                    }
                }, Table.api.events.operate)
            }
        },
        api: {
            //页面数据渲染方式
            formatter: {
                gotoClue: function (value, row, index) {
                    res = '<a href="javascript:;" class="bg-success btn-detail" data-id="' + row.id + '" title="' + value + '">' + value + '</a>';
                    return res;
                },
            },
        },
        action: {
            //派工单
            distributeWorkerOrder:function(params){
                $.when(
                    $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    url: '/clue/distributeWorkOrder',
                    data: params,
                    success: function (res) {
                        if(res.code == 1){
                            parent.Toastr.success(res.msg);
                            var index = parent.Layer.getFrameIndex(window.name);
                            parent.Layer.close(index);
                        }else{
                            Toastr.error(res.msg);
                        }
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                }),
                    ClueDetail.action.getWorkOrderList(),
                    ClueDetail.action.getDynamicList()
                ).done(function () {

                });


            }
            //增加新方法


        }
    };

    return Controller;

});
