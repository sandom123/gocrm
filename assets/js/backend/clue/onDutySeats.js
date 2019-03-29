define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/OnDutySeats/list',
                    add_url: '/OnDutySeats/add',
                    edit_url: '/OnDutySeats/edit',
                },

            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'id', title: 'ID',operate: false},
                        {field: 'on_duty_date', title: '日期',operate: '=', type: 'datetime', addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD"'},
                        {field: 'on_duty_ids', title:'人员列表',operate: false},
                        {field: 'org_sign', title: '所属组织',operate: '=',align: 'left', searchList: $.getJSON('/Ajax/getOrgListForSearch')},
                        {field: 'create_time', title: '创建时间',operate: false,type: 'datetime',addclass: 'datetimepicker', data: 'data-date-format="YYYY-MM-DD HH:mm:ss"'},
                        {field: 'create_by', title: '创建人',operate: false},
                        {field: 'operate', title: __('Operate'), events: Table.api.events.operate, formatter: function (value, row, index) {
                            return Table.api.formatter.operate.call(this, value, row, index, table);
                        }}
                    ]
                ],
                checkboxHeader:false,
                search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: false,
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
            Controller.api.bindevent();
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
            bindevent:function () {
                //$("#table").bootstrapTable('refresh');
            }
        }
    };

    return Controller;

});
