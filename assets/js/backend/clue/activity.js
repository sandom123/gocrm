define(['jquery', 'bootstrap', 'backend', 'table', 'form','backend/clue/detail'], function ($, undefined, Backend, Table, Form, ClueDetail) {

    var Controller = {
        //派工单
        index: function () {
            /**
             * 发送活动短信
             */
            $(".sendActivitySmsBtn").on('click', function(e){
                e.preventDefault();
                params = {};
                params.clue_id = CLUE_ID;
                Controller.action.sendActivitySms(params)
            });

            Form.api.bindevent($("form[role=form]"));
        },
        action: {
            //发送活动优惠短信
            sendActivitySms:function(params){
                $.when(
                    $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    url: '/clue/sendActivitySms',
                    data: params,
                    success: function (res) {
                        if(res.code == 1){
                            parent.$("#sendActivitySms").removeClass('btn-success').addClass("disabled btn-default").html('优惠短信已发送');
                            var index = parent.Layer.getFrameIndex(window.name);
                            parent.Layer.close(index);
                            parent.Toastr.success("优惠短信发送成功");
                        }else{
                            Toastr.error(res.msg);
                        }
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                }),
                    ClueDetail.action.getDynamicList()
                ).done(function () {

                });


            }
            //增加新方法


        }
    };

    return Controller;

});
