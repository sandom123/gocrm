define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/order/list',
                    add_url: '/order/create',
                    edit_url: '/order/edit',
                },
            });
            var table = $("#table");
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'id', title: '订单ID',operate: '=', align: 'left', style: 'width:120px;'},
                        {field: 'name', title: '客户姓名',operate: '=', align: 'left', style: 'width:120px;'},
                        {field: 'order_no', title: '订单编号',operate:"=", events: Controller.detailApi.events.orderdetail, formatter: Controller.api.formatter.order_no,style: 'width:120px;'},
                        {field: 'phone', title: '订单线索',operate: "LIKE", align: 'left',events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},
                        {field: 'way_source', title: '客户来源',operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch'),style: 'width:120px;',formatter: function(value, row, index){
                            if(value == 0){
                                return '';
                            }
                            return value;
                        }},
                        {field: 'channel_source', title: '渠道来源',operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'platform', title: '平台来源',operate: "LIKE", align: 'left',style: 'width:120px;'},

                        {field: 'turn_time', title: '建档日期',operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'category_id', title: '品类',operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch'),style: 'width:120px;' },
                        {field: 'cooperate_mode', title: '合作模式',operate: "=", align: 'left',searchList: $.getJSON('/Ajax/getCooperateModeListForSearch'),style: 'width:120px;'},
                        {field: 'region', title: '地区',operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'store_name', title: '商户', operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'contract_date', title: '合同日期', operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'service_date', title: '服务日期', operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'contract_amount', title: '合同金额', operate: false, align: 'left'},
                        {field: 'create_by', title: '创建人', operate: "=", align: 'left',searchList: $.getJSON('/Ajax/getOwerListForSearch') },
                        {field: 'create_time', title: '创建时间', operate: 'BETWEEN', align: 'left',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'operate', title: "操作", events: Controller.detailApi.events.orderdetail, formatter: function (value, row, index) {
                            var opt = '<a class="btn btn-xs btn-success btn-orderdetail">详情</a> ';
                            if(row.is_del == 1){
                                opt += '<a class="btn btn-xs btn-danger btn-delete">删除</a> ';
                            }
                            return opt;
                        }}
                    ]
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
            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        mylist: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/order/myOrderList',
                    add_url: '/order/create',
                    edit_url: '/order/edit',
                },

            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'id', title: '订单ID',operate: '=', align: 'left', style: 'width:120px;'},
                        {field: 'name', title: '客户姓名',operate: '=', align: 'left', style: 'width:120px;'},
                        {field: 'order_no', title: '订单编号',operate:"=", events: Controller.detailApi.events.orderdetail, formatter: Controller.api.formatter.order_no,style: 'width:120px;'},
                        {field: 'phone', title: '订单线索',operate: "LIKE", align: 'left',events: Controller.detailApi.events.operate, formatter: Controller.api.formatter.phone,style: 'width:120px;'},
                        {field: 'way_source', title: '客户来源',operate: "=", align: 'left', searchList: $.getJSON('/Ajax/getWaySourceListForSearch'),style: 'width:120px;',formatter: function(value, row, index){
                            if(value == 0){
                                return '';
                            }
                            return value;
                        }},
                        {field: 'channel_source', title: '渠道来源',operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'platform', title: '平台来源',operate: "LIKE", align: 'left',style: 'width:120px;'},

                        {field: 'turn_time', title: '建档日期',operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'category_id', title: '品类',operate: '=', align: 'left', searchList: $.getJSON('/Ajax/getCategoryListForSearch'),style: 'width:120px;' },
                        {field: 'cooperate_mode', title: '合作模式',operate: "=", align: 'left',searchList: $.getJSON('/Ajax/getCooperateModeListForSearch'),style: 'width:120px;'},
                        {field: 'region', title: '地区',operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'store_name', title: '商户', operate: "LIKE", align: 'left',style: 'width:120px;'},
                        {field: 'contract_date', title: '合同日期', operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'service_date', title: '服务日期', operate: 'BETWEEN', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'contract_amount', title: '合同金额', operate: false, align: 'left'},
                        {field: 'create_by', title: '创建人', operate: false, align: 'left'},
                        {field: 'create_time', title: '创建时间', operate: 'BETWEEN', align: 'left',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"',style: 'width:120px;'},
                        {field: 'operate', title: "操作", events: Controller.detailApi.events.orderdetail, formatter: function (value, row, index) {
                            var opt = '<a class="btn btn-xs btn-success btn-orderdetail">详情</a> ';
                            //opt += '<a class="btn btn-xs btn-danger btn-delete">删除</a> ';
                            return opt;
                        }}
                    ]
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
            // 为表格绑定事件
            Table.api.bindevent(table);
        },

        edit: function () {
            Form.api.bindevent($("form[role=form]"));
        },
        create: function () {
            Form.api.bindevent($("form[role=form]"), function(){
                category_id = $('select[name="order[category_id]"]').val();
                if(category_id == ''){
                    Toastr.error("请选择品类");
                    return false;
                }

                if($('select[name="order[cooperate_mode]"]').val() == ''){
                    Toastr.error("请选择合作模式");
                    return false;
                }
                if(category_id == 4 || category_id == 7 || category_id == 15){
                    if($('input[name="order[region]').val() == ''){
                        Toastr.error("地区不能为空");
                        return false;
                    }
                }else{
                    if($('select[name="order[city_code]').val() == ''){
                        Toastr.error("请选择地区");
                        return false;
                    }
                }

                if($('input[name="store_name"]').val() == ''){
                    Toastr.error("请选择商家");
                    return false;
                }

                if($('input[name="order[contract_amount]"]').val() == ''){
                    Toastr.error("请填写合同金额");
                    return false;
                }
                return true;
            }, function(obj, data, res){
                $(".createOrderBtn").addClass('disabled');
                conLayer = layer.confirm('订单创建成功！', {
                    title : '',
                    btn: ['查看订单详情','关闭'], //按钮,
                    cancel: function(){ //点击关闭后刷新列表
                        //取消后的操作
                        parent.window.location.reload();
                    }
                }, function(){
                    layer.close(conLayer);
                    orderNo = data.data;
                    var openUrl = '/order/detail?order_no='+orderNo;
                    var index = parent.Layer.getFrameIndex(window.name);
                    parent.layer.iframeSrc(index, openUrl);
                    parent.layer.title('订单详情', index);
                    //Backend.api.open(openUrl,'订单详情');
                }, function(){
                    //取消后的操作
                    parent.window.location.reload();
                });
            });

            /**
             * 修改品类
             */
            $("select[name='order[category_id]']").change(function(){
                selVal = $(this).val();
                if(selVal == 4 || selVal == 7 || selVal == 15){ //当品类选择全球旅拍、海外婚礼、蜜月游的时候,订单详情不同
                    $("#defaultAreaSel, #defaultOrderInfo").hide();
                    $("#HwAreaSel,#HwOrderInfo").show();
                }else{
                    $("#defaultAreaSel, #defaultOrderInfo").show();
                    $("#HwAreaSel,#HwOrderInfo").hide();
                }
            });

            /**
             * 商家选择
             */
            $(".btn-searchSeller").click(function(e){
                e.preventDefault();
                //Backend.api.open('/index/selectSeller','选择商家');
                openUrl = '/index/selectSeller';
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
                    title: '----选择商家',
                    maxmin: true,
                    cancel: function(){ //点击关闭后刷新列表
                        $("#table").bootstrapTable('refresh');
                    }
                });
                layer.full(index);
                layer.close(loading);
            });
        },
        detailApi: {
            events: {//绑定事件的方法
                operate: $.extend({
                    'click .btn-cluedetail': function (e, value, row, index) {
                        e.stopPropagation();
                        openUrl = '/clue/detail?id=' + row.clue_id;
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
                }, Table.api.events.operate),
                orderdetail: $.extend({
                    'click .btn-orderdetail': function (e, value, row, index) {
                        e.stopPropagation();
                        openUrl = '/order/detail?order_no=' + row.order_no;
                        Backend.api.open(openUrl, "订单详情");
                    },
                    'click .btn-delete': function (e, value, row, index) {
                        e.preventDefault();
                        tip = '订单号:<b class="text-danger">'+row.order_no+'</b><br />您确定要将此订单删除吗?';
                        conLayer = layer.confirm(tip, {
                            title : '删除订单提示',
                            btn: ['删除','取消'] //按钮
                        }, function(){
                            layer.close(conLayer);
                            params = {};
                            params.order_no = row.order_no;
                            Backend.api.ajax({url: '/order/delete',data:params}, function(){
                                $("#table").bootstrapTable('refresh');
                                Toastr.success("删除成功");
                            });//操作成功后刷新页面
                        }, function(){
                            //取消后的操作
                        });

                    }
                }, Table.api.events.operate)
            }
        },
        api: {
            // 单元格数据格式化
            formatter: {
                status: function (value, row, index, custom) {
                    //颜色状态数组,可使用red/yellow/aqua/blue/navy/teal/olive/lime/fuchsia/purple/maroon
                    value =value==1?'normal':'close';
                    var colorArr = {normal: 'success', hidden: 'grey', deleted: 'danger', locked: 'info'};
                    //如果有自定义状态,可以按需传入
                    if (typeof custom !== 'undefined') {
                        colorArr = $.extend(colorArr, custom);
                    }
                    value = value.toString();
                    var color = value && typeof colorArr[value] !== 'undefined' ? colorArr[value] : 'primary';
                    value = value.charAt(0).toUpperCase() + value.slice(1);
                    //渲染状态
                    var html = '<span class="text-' + color + '"><i class="fa fa-circle"></i> ' + __(value) + '</span>';
                    return html;
                },
                phone: function (value, row, index) {
                    res = '<a href="javascript:;" class="bg-success btn-cluedetail"  title="' + value + '">' + value + '</a>';
                    return res;
                },
                order_no: function (value, row, index) {
                    res = '<a href="javascript:;" class="bg-success btn-orderdetail"  title="' + value + '">' + value + '</a>';
                    return res;
                },
            },
        }
    };

    return Controller;

});
