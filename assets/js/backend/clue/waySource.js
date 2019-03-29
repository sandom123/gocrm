define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/waySource/list',
                    add_url: '/waySource/add',
                    edit_url: '/waySource/edit',
                },

            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'source_code', title: '线索来源Code',operate: "LIKE", align: 'left' ,style: 'width:120px;',sortable: true},
                        {field: 'source_name', title: '线索来源名称',operate: "LIKE", align: 'left' ,style: 'width:120px;'},
                        {field: 'source_describe', title: '状态描述',operate: false},
                        {field: 'source_url', title: '来源地址',operate: false},
                        {field: 'status', title: __('Status'), formatter: Controller.api.formatter.status,operate: false},
                        {field: 'operate', title: __('Operate'), events: Table.api.events.operate, formatter: function (value, row, index) {
                            return Table.api.formatter.operate.call(this, value, row, index, table);
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
            });
            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Form.api.bindevent($("form[role=form]"));
            Controller.api.bindevent();
        },
        edit: function () {
            Form.api.bindevent($("form[role=form]"));
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
                }
            },
        }
    };

    return Controller;

});
