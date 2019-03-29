define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'jstree'], function ($, undefined, Backend, Table, Form, undefined) {
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
                  //  index_url: 'data/group.json',
                    index_url: '/system/organization',
                    add_url: '/system/addOrganization',
                    edit_url: '/system/editOrganization',
                   // del_url: '/system/delOrganization',
//                    multi_url: 'data/multi.json',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                escape: false,
                columns: [
                    [
                        {field: 'state', checkbox: true},
                        {field: 'id', title: 'ID'},
                        {field: 'pid', title: __('Parent'), visible: false},
                        {field: 'pname', title: __('Parent')},
                        {field: 'name', title: __('Name'), align: 'left'},
                        {field: 'sign', title: '标识'},
                        {field: 'status', title: __('Status'), formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), events: Controller.api.events.operate, formatter: function (value, row, index) {
                                var detail = '<a class="btn btn-xs btn-info btn-addchildorg"><i class="fa fa-plus"></i></a> ';
                                return detail + "&nbsp;&nbsp;&nbsp;&nbsp;" +Table.api.formatter.operate.call(this, value, row, index, table);
                        }}
                    ]
                ],
                pagination: false,
                search: false,
                commonSearch: false,
                exportDataType: "basic",
                clickToSelect: false
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
                    $("input[name='row[rules]']").val(r.join(','));
                }
                return true;
            },
            events: {//绑定事件的方法
                operate: $.extend({
                    'click .btn-addchildorg': function (e, value, row, index) {
                        e.stopPropagation();
                        openUrl = '/system/addOrganization?pid=' + row.id;
                        Backend.api.open(openUrl, '添加子组织',{
                            cancel: function(index, layero){ //点击关闭后刷新列表
                                //$("#table").bootstrapTable('refresh');
                            }
                        });

                    }
                }, Table.api.events.operate)
            },
            bindevent: function () {
                Form.api.custom.refreshrules = Controller.api.refreshrules;
                //渲染权限节点树
                //变更级别后需要重建节点树
                $(document).on("change", "select[name='row[pid]']", function () {
                    var pid = $(this).data("pid");
                    var id = $(this).data("id");
                    if ($(this).val() == id) {
                        $("option[value='" + pid + "']", this).prop("selected", true).change();
                        Backend.api.toastr.error(__('Can not change the parent to self'));
                        return false;
                    }
                   /* $.ajax({
                        url: "data/roletree.json",
                        type: 'post',
                        dataType: 'json',
                        data: {id: id, pid: $(this).val()},
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
                    });*/


                    $(document).on('click','btn-addchildorg',function(){
                        alert('444');
                    });
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
