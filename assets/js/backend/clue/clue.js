define(['jquery', 'bootstrap', 'backend', 'table', 'form','template'], function ($, undefined, Backend, Table, Form,Template) {

    var Controller = {
        //新线索
        newclue:function(){
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/newClue',
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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',sortable: true,style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'create_time', title: "创建时间", operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',sortable: true, style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', sortable: true, style: 'width:120px;',formatter: function (value, row, index) {
                            if(value == row.create_time){
                                return '';
                            }
                            return value;
                        }},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left',sortable: true, style: 'width:120px;'},

                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'owner_id', title: "团队成员",operate: "=",visible: false,  align: 'left',searchList: $.getJSON('/Ajax/getOwerListForSearch') },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
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
            Controller.common(table);
        },
        //全部线索
        allclue:function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/allClue',
                    add_url: '/Clue/addClue',

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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left',style: 'width:120px;'},
                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'owner_id', title: "团队成员",operate: "=",visible: false,  align: 'left',searchList: $.getJSON('/Ajax/getOwerListForSearch') },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'turn_time', title: "转为客户时间",visible: false,operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},

                        {field: 'flow_state_id', title: "跟进状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left',style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'page_source', title: "页面来源",operate: 'LIKE', align: 'left',style: 'width:120px;'},

                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },


                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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
               // fixedColumns: false,//固定列
               // fixedNumber:4,//固定前两列
                //showExport: false,
                isShowMyExportBtn:true,

            });
            Controller.common(table);
        },
        //组织全部线索
        allorgclue:function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/allOrgClue',
                    add_url: '/Clue/addClue',

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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left',style: 'width:120px;'},

                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: false, align: 'left'},
                        {field: 'owner_id', title: "团队成员",operate: "=",visible: false,  align: 'left',searchList: $.getJSON('/Ajax/getOwerListForSearch?sign='+sign) },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left',style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left', style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },


                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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
            Controller.common(table);
        },
        //我的线索
        myclue:function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/myClue',
                    add_url: '/Clue/addClue',

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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone, style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left',style: 'width:120px;'},
                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'participation_type', title: "参与状态",operate: "=",visible: false,  align: 'left',searchList: {"all":"全部线索","my_responsible":"我负责的线索","my_participate":"我参与的线索",} },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left',style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left',style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },

                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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

            Controller.common(table);

        },
        //我的意向客户线索
        myclient:function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/myClient',
                    add_url: '/Clue/addClue',

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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left' },
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left' ,style: 'width:120px;'},
                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'participation_type', title: "参与状态",operate: "=",visible: false,  align: 'left',searchList: {"all":"全部线索","my_responsible":"我负责的线索","my_participate":"我参与的线索",} },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: false, align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'turn_time', title: "转为客户时间",visible: false,operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"'},

                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left',style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left',style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",operate: 'LIKE', align: 'left',style: 'width:120px;'},
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },

                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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

            Controller.common(table);

        },
        //我的未联系线索
        mynotcontact:function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/Clue/myNotContact',
                    add_url: '/Clue/addClue',

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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left' },
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: 'BETWEEN',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"', align: 'left' ,style: 'width:120px;'},
                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'participation_type', title: "参与状态",operate: "=",visible: false,  align: 'left',searchList: {"all":"全部线索","my_responsible":"我负责的线索","my_participate":"我参与的线索",} },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: '=', align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: false, align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left',style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",visible: false,operate: false, align: 'left' },
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },

                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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

            Controller.common(table);

        },
        discardedclue:function(){
            Table.api.init({
                extend: {
                    index_url: '/Clue/discardedClue',
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
                        {field: 'id', title: "线索ID",  operate: "=", align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left' },
                        {field: 'create_time', title: "创建时间", visible: false, operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_time', title: "跟进时间",operate: false, data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: false, align: 'left' },
                        {field: 'way_source', title: "线索来源",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'owner_id', title: "团队成员",operate: "=",visible: false,  align: 'left',searchList: $.getJSON('/Ajax/getOwerListForSearch') },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: "=", align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'category_id', title: "客户需求",operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch') },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",visible: false,operate: false, align: 'left' },
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },

                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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
            Controller.common(table);
        },
        searchclue:function(){
            Table.api.init({
                extend: {
                    index_url: '/Clue/clueSearch',
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
                        {field: 'id', title: "线索ID",  operate: '=', align: 'left',style: 'width:120px;'},
                        //显示在列表和搜索栏
                        {field: 'phone', title: "联系方式", align: 'left',operate: "=", events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},

                        {field: 'name', title: "姓名",operate: "LIKE", align: 'left' ,style: 'width:120px;'},
                        {field: 'create_time', title: "创建时间", visible: false, operate: false, addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"'},
                        {field: 'update_time', title: "跟进时间",operate: false, data: 'data-date-format="YYYY-MM-DD"'},
                        {field: 'update_by_name', title: "线索最新修改人",operate: false, align: 'left' },
                        {field: 'wedding_date', title: "婚期",operate: false, align: 'left' },
                        {field: 'way_source', title: "线索来源",operate: false, align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch')},
                        {field: 'org_sign', title: "所属组织",operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getAllOrgListTreeForSearch')},
                        {field: 'owner_id', title: "团队成员",operate: false,visible: false,  align: 'left',searchList: $.getJSON('/Ajax/getOwerListForSearch') },
                        {field: 'owner_name', title: "所属人",operate: false, align: 'left' },
                        {field: 'status_name', title: "线索状态",operate:false, align: 'left' , searchList: $.getJSON('/Ajax/getStatusNameForSearch')},
                        {field: 'flow_state_id', title: "跟进状态",operate: false, align: 'left' , searchList: $.getJSON('/Ajax/getFlowStateForSearch'),  },
                        {field: 'category_id', title: "客户需求",operate: false, align: 'left' },
                        {field: 'store_name', title: "商家名称",operate: false, align: 'left' },
                        {field: 'identity', title: "客户身份",operate: false, align: 'left' },
                        {field: 'platform', title: "平台",operate: '=', align: 'left',searchList:{'0':"其他",'1':"WEB",'2':"H5",'3':"M站",'4':"Android",'5':"IOS",'6':"小程序",'7':"其他APP",},formatter: Controller.api.formatter.platform },
                        {field: 'channel_source', title: "渠道来源",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},
                        {field: 'channel_code', title: "渠道码",operate: 'LIKE', align: 'left' ,style: 'width:120px;'},

                        {field: 'page_source', title: "页面来源",visible: false,operate: false, align: 'left' },
                        {field: 'comment', title: "备注",visible: false,operate: false, align: 'left' },
                        {field: 'phone_province', title: "电话所属省份",operate: false, align: 'left' },
                        {field: 'phone_city', title: "电话所属城市",operate: false, align: 'left' },

                        {field: 'operate', title: "操作", events: Controller.detailApi.events.operate, formatter: function (value, row, index) {
                            var detail = '<a class="btn btn-xs btn-success btn-detail">详情</a> ';
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
            Controller.common(table);
        },
        //添加
        add: function () {
            Form.api.bindevent($("form[role=form]"));
            Controller.api.bindevent();
        },

        /**
         * 导入线索
         */
        importclue:function(){
            Form.api.bindevent($("form[role=form]"));

            /**
             * 导入线索
             */
            $(".selClue").on("change", function(){
                if(!this.files || !this.files[0]){
                    Toastr.error("请选择要上传的文件");
                    return false;
                }
                var process = Layer.load();
                var picPath = this.files[0];
                var formdata = new FormData();
                formdata.append('file',picPath);
                formdata.append('step', 'parse');
                $.ajax({
                    url:'/clue/importClue',
                    type:'POST',
                    data:formdata,
                    dataType:"json",
                    cache: false,
                    contentType: false,
                    processData: false,
                    success:function(res){
                        if(res.code == 200){
                            trcontent = '';
                            data = res.data;
                            if(data.length > 0){
                                for(i in data){
                                    trcontent += "<tr><td>"+data[i].name+"</td><td>"+data[i].phone+"</td>";
                                    trcontent +=  "<td>"+data[i].identity+"</td>";
                                    trcontent +=  "<td>"+data[i].category_id+"</td>";
                                    trcontent +=  "<td>"+data[i].way_source+"</td>";
                                    trcontent +=  "<td>"+data[i].owner_id+"</td>";
                                    trcontent += "<td>"+data[i].comment+"</td></tr>";
                                }
                            }
                            $(".importClueListBoxTr").html(trcontent);
                            $(".importClueListBox").show();
                        }else{
                            Toastr.error(res.msg);
                        }
                    },
                    error:function(){
                        Toastr.error("网络出错，请重试~");
                    }
                });
                Layer.close(process);
                $(this).val("");
            });

            /**
             *派单按钮
             */
            $(".import_clue").on('click', function (e) {
                e.preventDefault();

                //注意，layer.msg默认3秒自动关闭，如果数据加载耗时比较长，需要设置time
                var loadingFlag= layer.msg('正在导入数据，请稍候……', { icon: 16, shade: 0.6,shadeClose:false,time:600000 });
                var formdata = new FormData();
                formdata.append('step', 'import');
               $.ajax({
                   url:'/clue/importClue',
                   type:'POST',
                   data:formdata,
                   dataType:"json",
                   cache: false,
                   contentType: false,
                   processData: false,
                   success:function(res){
                       if(res.code == 200){
                           tipTxt = "导入成功,共"+res.data.total+"条线索"+",成功:"+res.data.success+"条";
                           if(res.data.repeat > 0){
                               tipTxt += ",重复线索:"+res.data.repeat+"条";
                           }
                           if(res.data.error > 0){
                               tipTxt += ",导入错误:"+res.data.error+"条";
                           }
                           listdata = res.data.errorRows;
                           trcontent = '';
                           dataTxt = '';
                           if(listdata.length > 0){
                               dataTxt += '<a href="/ajax/downloadErrorClue">导入失败明细下载</a>  <span class="text-danger" style="font-size:10px;">下载修改正确后可直接用该文件进行导入</span><br />';
                               dataTxt += '<table class="table table-bordered table-hover">';
                               dataTxt += '<tr><th>行号</th><th>联系方式</th><th>错误信息</th></tr>';
                               for(i in listdata){
                                   dataTxt += "<tr><td>第"+listdata[i].e_no+"行</td>";
                                   dataTxt += "<td>"+listdata[i].phone+"</td>";
                                   dataTxt +=  "<td><span class='text-danger'>"+listdata[i].msg+"</span></td></tr>";
                               }
                               dataTxt += '</table>';
                           }
                           btn_t = '';
                           if(res.data.repeat > 0 || res.data.error > 0){
                               btn_t = '导入失败明细下载';
                           }
                           content = tipTxt + "<br />"+dataTxt;
                           layer.close(loadingFlag);
                           layer.alert(content,{
                               title:"导入提示",
                               area: ['560px', '350px'],
                               closeBtn:1,
                               btn: btn_t,
                               icon: 6,
                               yes:function(){
                                   window.location.href = "/ajax/downloadErrorClue";
                               },
                               cancel:function () {
                                   var index = parent.Layer.getFrameIndex(window.name);
                                   parent.Layer.close(index);
                               }
                           });
                           $(".import_clue").addClass('disabled');
                           //Toastr.success(tipTxt);
                       }else{
                           layer.close(loadingFlag);
                           Toastr.error(res.msg);
                       }

                   },
                   error:function(){
                       Toastr.error("网络错误，请重试");
                       return false;
                   }
               });

            });
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
                            maxmin: true,
                            cancel: function(){ //点击关闭后刷新列表
                                $("#table").bootstrapTable('refresh');
                            }
                        });
                        layer.full(index);
                        layer.close(loading);
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
                    res = '<a href="javascript:;" class="bg-success btn-detail" data-id="' + row.id + '" title="' + value + '">' + value + '</a>';
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

            }




        },
        common:function (table) {
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

            /**
             * 线索导入
             */
            $(".btn-import").on('click', function (e) {
                e.preventDefault();
                Backend.api.open('/clue/importClue', '批量导入',{
                    cancel: function(index, layero){ //点击关闭后刷新列表
                        $("#table").bootstrapTable('refresh');
                    }
                });
            });

        }


    };

    return Controller;

});

