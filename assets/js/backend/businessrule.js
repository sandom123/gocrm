define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'template'], function ($, undefined, Backend, Table, Form, Template) {

    var Controller = {
        cluerule: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/businessrule/cluerule',
                    add_url: '/businessrule/clueruleadd',
                    edit_url: '/businessrule/clueruleedit',
                    del_url: '/businessrule/clueruledel',
                    save_url: '/businessrule/clueruledel',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
//                sortName: 'priority',
                escape:false, 
                columns: [
                    [
                        {field: 'state', checkbox: true, },
                        {field: 'id', title: 'ID'},
                        {field: 'name', title: __('Name'), align: 'left', formatter: Controller.api.formatter.name},
                        {field: 'priority', title: '优先级'},
                        {field: 'status', title: __('Status'), formatter: Table.api.formatter.status= function(value, row, index,custom){
                            value=value==1?'normal':'hidden';
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
                                                                                                               
                        }},
                        {field: 'operate', title: __('Operate'), events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ],
                pagination: false,
                search: false,
                commonSearch: false,
            });

            // 为表格绑定事件
            Table.api.bindevent(table);//当内容渲染完成后

        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            formatter: {
                name: function (value, row, index) {
                    return !row.ismenu ? "<span class='text-muted '>" + value + "</span>" : value;
                },
            },
            bindevent: function () {
                 $('#btn-save').click(function(){
                     alert(1);
                 
                 });
            }
        }
    };
    return Controller;
});
