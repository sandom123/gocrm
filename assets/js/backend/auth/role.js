define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'jstree'], function ($, undefined, Backend, Table, Form, undefined) {
    /**
     * 父级选中,子集不跟着全部选中
     * @type {{visible: boolean, three_state: boolean, whole_node: boolean, keep_selected_style: boolean, cascade: string, tie_selection: boolean, cascade_to_disabled: boolean, cascade_to_hidden: boolean}}
     */
    $.jstree.defaults.checkbox = {
        visible: true,
        three_state: true,
        whole_node: true,
        keep_selected_style: true,
        cascade: '',
        tie_selection: true,
        /**
         * This setting controls if cascading down affects disabled checkboxes
         * @name $.jstree.defaults.checkbox.cascade_to_disabled
         * @plugin checkbox
         */
        cascade_to_disabled : false,
        cascade_to_hidden : true
    };

    //读取选中的条目
    $.jstree.core.prototype.get_all_checked = function (full) {
        var obj = this.get_selected(), i, j;
        for (i = 0, j = obj.length; i < j; i++) {
            obj = obj.concat(this.get_node(obj[i]).parents);
        }
        obj = $.grep(obj, function (v, i, a) {
            return v != '#';
        });
        obj = obj.filter(function (itm, i, a) {
            return i == a.indexOf(itm);
        });
        return full ? $.map(obj, $.proxy(function (i) {
            return this.get_node(i);
        }, this)) : obj;
    };

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/user/role',
                    add_url: '/user/roleAdd',
                    edit_url: '/user/roleEdit',
                    del_url: '/user/roleDel',
                }
            });

            var table = $("#table");
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                escape: false,
                columns: [
                    [
                        {field: 'state', checkbox: true, },
                        {field: 'id', title: 'ID'},
                        {field: 'name', title: __('Name'), align: 'left'},
                        {field: 'status', title: __('Status'), formatter: Table.api.formatter.status= function(value, row, index,custom){
                            value=value==1?'normal':'close';
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
                        {field: 'operate', title: __('Operate'), events: Table.api.events.operate, formatter: function (value, row, index) {
                                return Table.api.formatter.operate.call(this, value, row, index, table);
                            }}
                    ],
                ],
                /**rowStyle: function (row, index) {
                    var classesArr = ['success', 'info'];
                    var strclass = "";
                    if (index % 2 === 0) {//偶数行
                        strclass = classesArr[0];
                    } else {//奇数行
                        strclass = classesArr[1];
                    }
                    return { classes: strclass };
                },//隔行变色**/
                pagination: false,
                search: false,
                commonSearch: false,
                sortName: 'id', // 要排序的字段
                sortOrder: 'desc', // 排序规则
                striped: true,                      //是否显示行间隔色
                showToggle: false,
                exportDataType: "basic",
            });

            // 为表格绑定事件
            Table.api.bindevent(table);//当内容渲染完成后

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
            refreshrules: function () {
                if ($("#treeview").size() > 0) {
                    var r = $("#treeview").jstree("get_all_checked");
                    $("input[name='row[roles]']").val(r.join(','));
                }
                return true;
            },
            bindevent: function () {
                Form.api.custom.refreshrules = Controller.api.refreshrules;
                    var id=$('input[name="ids"]').val();
                    //var id = $("#role_id").data("id");
                    $.ajax({
                        url: "/ajax/roletree",
                        type: 'post',
                        dataType: 'json',
                        data: {id: id},
                        success: function (ret) {
                            if (ret.hasOwnProperty("code")) {
                                var data = ret.hasOwnProperty("data") && ret.data != "" ? ret.data : "";
                                if (ret.code === 1) {
                                    //销毁已有的节点树
                                    $("#treeview").jstree("destroy");
                                    Controller.api.rendertree(data);
                                } else {
                                    Backend.api.toastr.error(ret.data);
                                }
                            }
                        }, error: function (e) {
                            Backend.api.toastr.error(e.message);
                        }
                    });

                //全选和展开
                $(document).on("click", "#checkall", function () {
                    $("#treeview").jstree($(this).prop("checked") ? "check_all" : "uncheck_all");
                });
                $(document).on("click", "#expandall", function () {
                    $("#treeview").jstree($(this).prop("checked") ? "open_all" : "close_all");
                });
                $("select[name='row[pid]']").trigger("change");
            },
            rendertree: function (content) {
                $("#treeview")
                        .on('redraw.jstree', function (e) {
                            $("#treeview").jstree( "open_all");
                            $(".layer-footer").attr("domrefresh", Math.random());
                        })
                        .jstree({
                            "themes": {"stripes": true},
                            "checkbox": {
                                "keep_selected_style": false,
                            },
                            "types": {
                                "root": {
                                    "icon": "fa fa-folder-open",
                                },
                                "menu": {
                                    "icon": "fa fa-folder-open",
                                },
                                "file": {
                                    "icon": "fa fa-file-o",
                                }
                            },
                            "plugins": ["checkbox", "types"],
                            "core": {
                                'check_callback': true,
                                "data": content
                            }
                        });
            }
        }
    };
    return Controller;
});
