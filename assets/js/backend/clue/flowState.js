define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/flowState/list',
                    add_url: '/flowState/add',
                    edit_url: '/flowState/edit',
                },

            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'id', title: '跟进状态ID'},
                        {field: 'state_name', title: __('name'),operate:"LIKE"},
                        {field: 'state_describe', title: '状态描述'},
                        /*{field: 'type', title: "类型", formatter: function(value, row, index){
                            if(value == 1){
                                return '普通';
                            }else if(value == 2){
                                return '客户';
                            }else{
                                return '';
                            }
                        }},*/
                        {field: 'weigh', title: '权重'},
                        {field: 'status', title: __('Status'), formatter: Controller.api.formatter.status},
                        {field: 'operate', title: __('Operate'), events: Table.api.events.operate, formatter: function (value, row, index) {
                            return Table.api.formatter.operate.call(this, value, row, index, table);
                        }}
                    ]
                ],
                checkboxHeader:false,
                search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: false,
                commonSearch: false,
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
