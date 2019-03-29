define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index:function(){
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/logger/loginlog',
                }
            });
        },
        //登录日志
        loginlog: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/logger/loginlog',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        //默认隐藏该列
                        {field: 'id', title: "ID", visible: false, operate: false, align: 'left'},
                        //直接响应搜索
                        {field: 'name', title: "用户名", align: 'left'},
                        {field: 'account', title: "账号", align: 'left', operate:false },
                        {field: 'last_ip', title: "源IP地址", align: 'left', operate:false },
                        {field: 'last_time', title: "最后登录时间", operate: 'BETWEEN', type: 'datetime', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD HH:mm:ss"'},

                        {field: 'operate', title: "操作", events: Controller.loginlogApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
                            return detail + Table.api.formatter.operate.call(this, value, row, index, table);
                        }}
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
            });

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                $("button[name='commonSearch']").hide();
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

        },

        //操作日志
        operationlog: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/logger/operationlog',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'name', title: "用户名"},
                        {field: 'operation_time', title: "操作时间", operate: 'BETWEEN', type: 'datetime', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD HH:mm:ss"'},
                        {field: 'operation_table', title: "数据表",operate: false},
                        {field: 'data_name', title: "数据名称", align: 'left' ,searchList: $.getJSON('/Ajax/getOperationInfo?datatype=data_name') },
                        {field: 'data_id', title: "数据ID"},
                        //search: action，操作行为类型，ajax获取
                        {field: 'action_chn', title: "行为", align: 'left' ,searchList: $.getJSON('/Ajax/getOperationInfo?datatype=action')  },
                        //search: belong_type，操作行为类型，ajax获取
                        //{field: 'belong_id', title: "对象ID", align: 'left', operate:false },
                        {field: 'operate', title: "操作", events: Controller.operationlogApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
                            return detail + Table.api.formatter.operate.call(this, value, row, index, table);
                        }}

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
            });

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                $("button[name='commonSearch']").hide();
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

        },

        //短信日志
        smslog: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/logger/smslog',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        //默认隐藏该列
                        {field: 'id', title: "ID", visible: false, operate: false, align: 'left'},
                        //直接响应搜索
                        {field: 'mobile', title: "手机号", align: 'left'},
                        {field: 'content', title: "内容", align: 'left', operate:false },
                        {field: 'create_time', title: "发送时间", operate: 'BETWEEN', type: 'datetime', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD HH:mm:ss"'},
                        {field: 'status', title: "发送状态", align: 'left', operate:'=', searchList: {1:"成功", 0:"失败"}},
                        {field: 'code', title: "状态码", align: 'left', operate:false },
                        {field: 'msgID', title: "短信ID", align: 'left', operate:false },
                        {field: 'message', title: "发送结果", align: 'left', operate:false},
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
            });

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                $("button[name='commonSearch']").hide();
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

        },
        //=============== 事件
        loginlogApi: {
            events: {//绑定事件的方法
                operate: $.extend({
                    'click .btn-detail': function (e, value, row, index) {
                        e.stopPropagation();
                        Backend.api.open('/logger/loginDetail?id=' + row['id'], "登录日志详情");
                    }
                }, Table.api.events.operate)
            }
        },


        operationlogApi: {
            events: {//绑定事件的方法
                operate: $.extend({
                    'click .btn-detail': function (e, value, row, index) {
                        e.stopPropagation();
                        Backend.api.open('/logger/operationDetail?id=' + row['id'], "操作日志详情");
                    }
                }, Table.api.events.operate)
            }
        }




    };

    return Controller;
});