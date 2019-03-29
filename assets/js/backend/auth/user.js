define(['jquery', 'bootstrap', 'backend', 'table', 'form','upload'], function ($, undefined, Backend, Table, Form, Upload) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/user/list',
                    add_url: '/user/add',
                    edit_url: '/user/edit',
                    del_url: '/user/del',
                    //multi_url: 'data/multi.json',
                },

            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        {field: 'state', checkbox: true, },
                        {field: 'id', title: 'ID'},
                        {field: 'account', title: __('account'),operate:"LIKE"},
                        {field: 'name', title: __('name'),operate:"LIKE"},
                        //{field: 'groups_text', title: __('Group'), operate:false, formatter: Table.api.formatter.label},
                        {field: 'email', title: __('Email'),operate:false},
                        {field: 'org_name', title: '组织',operate:false},
                        {field: 'role_name', title: '角色',operate:false},
                        {field: 'status', title: __("Status"), searchList: {"normal": __('Normal'), "close": __('Close')},formatter: Table.api.formatter.status},
                        {field: 'last_time', title: __('Login time'),operate:false},
                        {field: 'operate', title: __('Operate'), events: Table.api.events.operate, formatter: function (value, row, index) {
                                if(row.id == 1){
                                    return '';
                                }
                                return Table.api.formatter.operate.call(this, value, row, index, table);
                            }}
                    ]
                ],
                checkboxHeader:false,
                search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: false,
                commonSearch: true,
                exportDataType: "basic",
                searchFormVisible: true,
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
            $('input[name="changeWaySource"]').click(function(){
                waySource = $(this).val()
                if(waySource == 1){
                    $("#selfDefinedSelect").hide();
                }else{
                    $("#selfDefinedSelect").show();
                }
            });
        },

        //个人资料页
        profile : function(){
            Form.api.bindevent($("form[role=form]"));
            // 给上传按钮添加上传成功事件
            $("#plupload-avatar").data("upload-success", function (data) {
                var url = Backend.api.cdnurl(data.url);
                $(".profile-user-img").prop("src", url);
                Toastr.success("上传成功！");
            });

            // 给表单绑定事件
            Form.api.bindevent($("#update-form"), function () {
                //$("input[name='row[password]']").val('');
                //var url = Backend.api.cdnurl($("#c-avatar").val());
                //top.window.$(".user-panel .image img,.user-menu > a > img,.user-header > img").prop("src", url);
                return true;
            });
        },
        api: {
            bindevent:function(){
            // $(document).on("change","select[name=\"row[org_id]\"]",function(){
            //     var id= $(this).val();
            //    $("#roles").empty();
            //     $.getJSON('/ajax/getRole?org_id='+id,function(ret){
            //         if(ret.code==1){
            //             var option="";
            //             $(ret.data).each(function(k,v){
            //                 option+='<option value="'+v.id+'">'+v.name+'</option>';
            //             })
            //            $("#roles").append(option)
            //         }
            //     });
            // })
            }
        }
    };

    return Controller;

});
