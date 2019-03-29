define(['jquery', 'bootstrap', 'backend', 'addtabs', 'adminlte', 'form', 'toastr'], function ($, undefined, Backend, undefined, AdminLTE, Form, Toastr) {
    var Controller = {
        detail: function () {
            Form.api.bindevent($("form[role=form]"));
            Controller.action.getDynamicList();//获取跟进记录
            Controller.action.getWorkOrderList();//获取工单列表
            Controller.action.getTeamMemberList();//获取团队列表
            /**
             * 转移线索
             */
            $(".operate-transfer").on('click', function (e) {
                e.preventDefault();
                Backend.api.open('/clue/transfer?clue_id='+CLUE_ID,'转移销售线索',{height:'30%'});
            });

            /**
             * 转为客户
             */
            $(".operate-turn").on('click', function (e) {
                e.preventDefault();
                tip = '您确定要将此线索转为客户吗?';
                conLayer = layer.confirm(tip, {
                    title : '转为客户',
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(conLayer);
                    params = {};
                    params.clue_id = CLUE_ID;
                    Backend.api.ajax({url: "/clue/turnCustomer",data:params}, afterSuccessFresh);//操作成功后刷新页面
                }, function(){
                    //取消后的操作
                });
            });

            /**
             * 成功后刷新页面
             * @param data
             */
            function afterSuccessFresh(data) {
                window.location.reload();
            }
            /**
             * 退回线索
             */
            $(".operate-return").on('click', function (e) {
                e.preventDefault();
                Backend.api.open('/clue/return?clue_id='+CLUE_ID,'退回线索');
            });

            /**
             * 废弃线索
             */
            $(".operate-discard").on('click', function (e) {
                e.preventDefault();
                tip = '您确定要将此线索废弃吗?';
                conLayer = layer.confirm(tip, {
                    title : '线索废弃',
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(conLayer);
                    params = {};
                    params.clue_id = CLUE_ID;
                    Backend.api.ajax({url: "/clue/discard",data:params}, afterSuccessFresh);//操作成功后刷新页面
                }, function(){
                    //取消后的操作
                });
            });

            /**
             * 线索领取
             */
            $(".operate-get").on("click", function(e){
                e.preventDefault();
                tip = '您确定要领取此线索吗?';
                conLayer = layer.confirm(tip, {
                    title : '线索领取',
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(conLayer);
                    params = {};
                    params.id = CLUE_ID;
                    Backend.api.ajax({url: "/clue/getClue",data:params}, afterSuccessFresh);//操作成功后刷新页面
                }, function(){
                    //取消后的操作
                });
            });

            /**
             * 创建订单
             */
            $(".create-order-btn").on("click", function(e){
                e.preventDefault();
                clueStatus = $(this).attr('data-clue-status');
                if(clueStatus != 3){
                    conLayer = layer.confirm('当前线索未转为客户，是否需要把线索转为客户并创建订单？', {
                        title : '创建订单',
                        btn: ['是','否'] //按钮
                    }, function(){
                        layer.close(conLayer);
                        params = {};
                        params.clue_id = CLUE_ID;
                        Backend.api.ajax({url: "/clue/turnCustomer",data:params}, createOrder);//操作成功后刷新页面
                    }, function(){
                        //取消后的操作
                        layer.close(conLayer);
                    });
                }else{
                    createOrder();
                }
            });

            /**
             * 创建订单
             */
            function createOrder() {
                Backend.api.open('/order/create?clue_id='+CLUE_ID,'创建订单',{
                    cancel: function(index, layero){ //点击关闭后刷新列表
                        frameSrc = $(layero).find("iframe").attr("src");
                        if(frameSrc && frameSrc.indexOf('order/detail') > 0){
                            window.location.reload();
                        }
                    }
                });
            }

            /**
             * 查看订单
             */
            $(".checkOrder").click(function(){
                orderNo = $(this).attr('data-order-sn');
                Backend.api.open('/order/detail?order_no='+orderNo,'订单详情');
            });

            /**
             * 外呼
             */
            $(".doCall").on('click', function (e) {
                Controller.action.doCall();
            });
            $(".doCallMoor").on('click', function (e) {
                Controller.action.doCallMoor();
            });
            /**
             * 保存基本信息按钮
             */
            $(".save-clue").on('click', function (e) {
                e.preventDefault();
                params = {
                    clue:{},
                    clue_info:{}
                };
                params.clue_id = CLUE_ID;
                params.clue.name = $("input[name='clue[name]']").val();
                params.clue.identity = $("select[name='clue[identity]']").val();
                category_id = $("select[name='clue[category_id]']").val();
                if(category_id) params.clue.category_id = category_id;
                wedding_date = $("input[name='clue[wedding_date]']").val();
                if(wedding_date) params.clue.wedding_date = wedding_date;
                params.clue.comment = $.trim($("textarea[name='clue[comment]']").val());
                area_choice = $("select[name='clue[area_choice]']").val();
                params.clue.area_choice = area_choice;
                Controller.action.updateClueInfo(params);
            });

            /**
             * 保存扩展信息按钮
             */
            $(".save-clue-info").on('click', function (e) {
                e.preventDefault();
                params = {
                    clue:{},
                    clue_info:{}
                };

                var priceReg = /(^[1-9]([0-9]+)?(\.[0-9]*)?$)|(^(0){1}$)|(^(0){1}\.[0-9]+$)/;
                var numReg = /^(0|[1-9][0-9]*)$/;

                params.clue_id = CLUE_ID;
                params.clue_info.hyjd_tables = $("input[name='clue_info[hyjd_tables]']").val();
                if(params.clue_info.hyjd_tables && !numReg.test(params.clue_info.hyjd_tables)){
                    Toastr.error("婚宴酒店桌数格式不正确");
                    return false;
                }
                params.clue_info.hyjd_meal_price = $("input[name='clue_info[hyjd_meal_price]']").val();
                if(params.clue_info.hyjd_meal_price && !priceReg.test(params.clue_info.hyjd_meal_price)){
                    Toastr.error("婚宴酒店餐标格式不正确");
                    return false;
                }
                params.clue_info.hyjd_budgetary_amount = $("input[name='clue_info[hyjd_budgetary_amount]']").val();
                if(params.clue_info.hyjd_budgetary_amount && !priceReg.test(params.clue_info.hyjd_budgetary_amount)){
                    Toastr.error("婚宴酒店预订金额格式不正确");
                    return false;
                }

                params.clue_info.hqfw_budgetary_amount = $("input[name='clue_info[hqfw_budgetary_amount]']").val();
                if(params.clue_info.hqfw_budgetary_amount && !priceReg.test(params.clue_info.hqfw_budgetary_amount)){
                    Toastr.error("婚礼策划预算格式不正确");
                    return false;
                }
                params.clue_info.hqfw_determine_hotel = $("input[name='clue_info[hqfw_determine_hotel]']:checked").val();
                params.clue_info.hqfw_hotel_name = $("input[name='clue_info[hqfw_hotel_name]']").val();

                params.clue_info.hssy_price = $("input[name='clue_info[hssy_price]']").val();
                if(params.clue_info.hssy_price && !priceReg.test(params.clue_info.hssy_price)){
                    Toastr.error("婚纱摄影价位格式不正确");
                    return false;
                }
                params.clue_info.hssy_style = $("input[name='clue_info[hssy_style]']").val();

                params.clue_info.lp_budgetary_amount = $("input[name='clue_info[lp_budgetary_amount]']").val();
                if(params.clue_info.lp_budgetary_amount && !priceReg.test(params.clue_info.lp_budgetary_amount)){
                    Toastr.error("全球旅拍预算格式不正确");
                    return false;
                }
                params.clue_info.lp_destination = $("input[name='clue_info[lp_destination]']").val();

                params.clue_info.hwhl_budgetary_amount = $("input[name='clue_info[hwhl_budgetary_amount]']").val();
                if(params.clue_info.hwhl_budgetary_amount && !priceReg.test(params.clue_info.hwhl_budgetary_amount)){
                    Toastr.error("海外婚礼预算格式不正确");
                    return false;
                }
                params.clue_info.hwhl_destination = $("input[name='clue_info[hwhl_destination]']").val();
                isEmpty = true;
                for(field in params.clue_info){
                    val = params.clue_info[field];
                    if(val != '' && val != undefined ){
                        isEmpty = false;
                        break;
                    }
                }
                if(isEmpty){
                    Toastr.error("客户需求不能都为空");
                    return false;
                }

                Controller.action.updateClueInfo(params);
            });

            /**
             * 修改用户身份
             */
            /**$("select[name='clue[identity]']").on('change', function (e) {
                e.preventDefault();
                params = {};
                params.clue_id = CLUE_ID;
                params.identity = $(this).val();
                Controller.action.updateClueInfo(params);
            });**/

            /**
             * 修改客户需求
             */
            /**$("select[name='clue[category_id]']").on('change', function (e) {
                e.preventDefault();
                params = {};
                params.clue_id = CLUE_ID;
                params.category_id = $(this).val();
                Controller.action.updateClueInfo(params);
            });**/

            /**
             * 修改婚期
             */
            /**$("input[name='clue[wedding_date]']").on('blur', function (e) {
                e.preventDefault();
                params = {};
                params.clue_id = CLUE_ID;
                params.wedding_date = $(this).val();
                Controller.action.updateClueInfo(params);
            });**/



            /**
             * 保存跟进记录
             */
            $(".save-trace-record").on('click', function (e) {
                e.preventDefault();
                Controller.action.saveTraceRecord();
            });

            /**
             * 点击派工单按钮
             */
            $("#addWorkerOrder").on('click', function (e) {
                e.preventDefault();
                Controller.action.addWorkerOrder();
            });

            /**
             * 点击发送优惠短信按钮
             */
            $("#sendActivitySms").on('click', function (e) {
                e.preventDefault();
                if($(this).hasClass("disabled")){
                    return false;
                }
                Controller.action.sendActivitySms();
            });

            $("[switch='hlchBox'],[switch='hssyBox'],[switch='lpBox'],[switch='hwhlBox']").on("click", function () {
                boxName = $(this).attr('switch');
                $("."+boxName).show();
            });

            $(".clue-info-minus").on('click', function (e) {
                e.preventDefault();
                $(this).parent().parent().find('input').val('');
                $(this).parent().parent().hide();
            });

            /**
             * 查看操作记录
             */
            $(".view-operate_record").on('click', function (e) {
                e.preventDefault();
                Backend.api.open('/clue/operateRecord?clue_id='+CLUE_ID,'查看操作记录');
            });

            /**
             * 查看通话记录
             */
            $(".view-call_record").on('click', function (e) {
                e.preventDefault();
                Backend.api.open('/clue/callRecord?clue_id='+CLUE_ID,'查看通话记录');
            });

            /**
             * 添加团队成员
             */
             $(document).on("click", ".addTeamMember", function (e) {
                e.preventDefault();
                Backend.api.open('/clue/addTeamMember?clue_id='+CLUE_ID,'添加团队成员');
            });

            /**
             * 移除团队成员
             */
            $(document).on("click", ".removeTeamMemberBtn", function (e) {
                e.preventDefault();
                var dataname = $(this).attr("data-name");
                var dataid = $(this).attr("data-id");
                tip = '您确定要将'+dataname+'移除当前团队吗?';
                conLayer = layer.confirm(tip, {
                    title : '移除团队成员',
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(conLayer);
                    params = {};
                    params.clue_id = CLUE_ID;
                    params.members_id = dataid;
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: '/clue/removeTeamMember',
                        data: params,
                        success: function (res) {
                            if(res.code == 1){
                                Toastr.success(res.msg);
                                Controller.action.getTeamMemberList();//局部刷新团队成员列表
                                Controller.action.getDynamicList();
                            }else{
                                Toastr.error(res.msg);
                            }
                        },
                        error : function(){
                            Toastr.error("网络错误,请稍后重试");
                        }
                    });
                }, function(){
                    //取消后的操作
                });
            });

            /**
             * 退出团队
             */
            $(document).on("click", ".quitTeamBtn", function (e) {
                e.preventDefault();
                var dataid = $(this).attr("data-id");
                tip = '您确定要退出此团队吗?';
                conLayer = layer.confirm(tip, {
                    title : '出此团队',
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(conLayer);
                    params = {};
                    params.clue_id = CLUE_ID;
                    params.members_id = dataid;
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: '/clue/quitTeam',
                        data: params,
                        success: function (res) {
                            if(res.code == 1){
                                Toastr.success(res.msg);
                                Controller.action.getTeamMemberList();//局部刷新团队成员列表
                                Controller.action.getDynamicList();
                            }else{
                                Toastr.error(res.msg);
                            }
                        },
                        error : function(){
                            Toastr.error("网络错误,请稍后重试");
                        }
                    });
                }, function(){
                    //取消后的操作
                });
            });

        },

        //线索转换
        transfer: function () {
            Form.api.bindevent($("form[role=form]"), null, function(){
                //提示及关闭当前窗口
                parent.Toastr.success(__('Operation completed'));
                parent.$(".btn-refresh").trigger("click");
                var index = parent.Layer.getFrameIndex(window.name);
                parent.Layer.close(index);
                parent.location.reload();
            });
        },

        //退回线索
        return:function(){
            Form.api.bindevent($("form[role=form]"), null, function(){
                //提示及关闭当前窗口
                parent.Toastr.success(__('Operation completed'));
                parent.$(".btn-refresh").trigger("click");
                var index = parent.Layer.getFrameIndex(window.name);
                parent.Layer.close(index);
                parent.location.reload();
            });
        },

        //添加团队成员
        team:function(){
            Form.api.bindevent($("form[role=form]"));
            $(".saveTeamMemberBtn").on('click', function(e){
                e.preventDefault();
                params = {};
                params.clue_id = CLUE_ID;
                params.members_id = $("select[name='members_id']").val();
                Controller.action.addTeamMember(params)
            });
        },
        action: {
            //修改线索信息
            updateClueInfo: function (params) {
              Backend.api.ajax({url: "/clue/updateClueInfo",data:params});//操作成功后刷新页面
            },
            //保存跟进记录
            saveTraceRecord: function () {
                params = {};
                params.clue_id = CLUE_ID;
                params.flow_state_id = $("select[name='flow[flow_state_id]']").val();
                if(params.flow_state_id == ''){
                    Toastr.error("请选择跟进状态");
                    return false;
                }
                params.next_contact_time = $("input[name='flow[next_contact_time]']").val();
                params.comment = $("textarea[name='flow[comment]']").val();
                if(params.comment){
                    params.comment = params.comment.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' '); //转换格式
                }
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/clue/saveTraceRecord',
                    data: params,
                    success: function (res) {
                       if(res.code == 1){
                           $("textarea[name='flow[comment]']").val("");
                           Toastr.success(res.msg);
                           Controller.action.getDynamicList();//局部刷新跟进记录列表
                       }else{
                           Toastr.error(res.msg);
                       }
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                });
            },
            //获取跟进记录列表
            getDynamicList: function(){
                var process = Layer.load();
                var params = {};
                params.clue_id = CLUE_ID;
                $.ajax({
                    type: 'GET',
                    dataType: 'html',
                    async: false,
                    url: '/ajax/getDynamicList',
                    data: params,
                    success: function (res) {
                        Layer.close(process);
                        $("#traceRecordList").html(res);
                        parent.$("#traceRecordList").html(res);//派工单页面成功时需要用
                    }
                });

            },
            //获取工单列表
            getWorkOrderList: function(){
                var process = Layer.load();
                var params = {};
                params.clue_id = CLUE_ID;
                $.ajax({
                    type: 'GET',
                    dataType: 'html',
                    url: '/ajax/getWorkOrderList',
                    async: false,
                    data: params,
                    success: function (res) {
                        Layer.close(process);
                        $("#workOrderList").html(res);
                        parent.$("#workOrderList").html(res);//派工单页面成功时需要用
                    }
                });

            },
            //添加派工单
            addWorkerOrder:function(){
                Backend.api.open('/clue/distributeWorkOrder?clue_id='+CLUE_ID,'新建派工单');
            },
            //发送优惠短信
            sendActivitySms:function(){
                Backend.api.open('/clue/sendActivitySms?clue_id='+CLUE_ID,'发送优惠短信',{ maxmin:true, type: 2});
            },
            //外呼
            doCall:function(){
                var loading = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                params = {};
                params.clue_id = CLUE_ID;
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/clue/doCall',
                    data: params,
                    success: function (res) {
                        if(res.code == 200){
                            title = '外呼成功';
                            layer.alert(res.msg, {
                                title: title
                                ,closeBtn: 0
                                ,anim: 4 //动画类型
                            });
                        }else{
                            Toastr.error(res.msg);
                        }
                        layer.close(loading);
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                });
            },
//七陌外呼
            doCallMoor:function(){
                var loading = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                params = {};
                params.clue_id = CLUE_ID;
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/clue/dialout',
                    data: params,
                    success: function (res) {
                        if(res.code == 200){
                            title = '外呼成功';
                            layer.alert(res.msg, {
                                title: title
                                ,closeBtn: 0
                                ,anim: 4 //动画类型
                            });
                        }else{
                            Toastr.error(res.msg);
                        }
                        layer.close(loading);
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                });
            },
            //添加团队成员
            addTeamMember:function(params){
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/clue/addTeamMember',
                    data: params,
                    success: function (res) {
                        if(res.code == 1){
                            Toastr.success(res.msg);
                            var index = parent.Layer.getFrameIndex(window.name);
                            parent.Layer.close(index);
                            Controller.action.getTeamMemberList();
                            Controller.action.getDynamicList();
                        }else{
                            Toastr.error(res.msg);
                        }
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                });
            },

            /**
             * 获取团队成员列表
             */
            getTeamMemberList:function(){
                var params = {};
                params.clue_id = CLUE_ID;
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: '/ajax/getClueTeamMemberList',
                    async: false,
                    data: params,
                    success: function (res) {
                        if(res.total > 0){
                            $("#teamMemberTotal").html(res.total);
                            $("#teamMemberList").html(res.list);
                            parent.$("#teamMemberTotal").html(res.total);
                            parent.$("#teamMemberList").html(res.list);
                        }
                    }
                });
            }


        }
    };

    return Controller;
});