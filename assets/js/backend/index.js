define(['jquery', 'bootstrap', 'backend', 'addtabs', 'adminlte', 'form','table'], function ($, undefined, Backend, undefined, AdminLTE, Form, Table) {
    var Controller = {
        index: function () {
            //窗口大小改变,修正主窗体最小高度
            $(window).resize(function () {
                $(".tab-addtabs").css("height", $(".content-wrapper").height() + "px");
            });

            //双击重新加载页面
            $(document).on("dblclick", ".sidebar-menu li > a", function (e) {
                $("#tab_" + $(this).attr("addtabs") + " iframe").attr('src', function (i, val) {
                    return val;
                });
                e.stopPropagation();
            });

            //快捷搜索
            $(".menuresult").width($("form.sidebar-form > .input-group").width());
            var isAndroid = /(android)/i.test(navigator.userAgent);
            var searchResult = $(".menuresult");
            $("form.sidebar-form").on("blur", "input[name=q]", function () {
                searchResult.addClass("hide");
                if (isAndroid) {
                    $.AdminLTE.options.sidebarSlimScroll = true;
                }
            }).on("focus", "input[name=q]", function () {
                if (isAndroid) {
                    $.AdminLTE.options.sidebarSlimScroll = false;
                }
                if ($("a", searchResult).size() > 0) {
                    searchResult.removeClass("hide");
                }
            }).on("keyup", "input[name=q]", function () {
                searchResult.html('');
                var val = $(this).val();
                var html = new Array();
                if (val != '') {
                    $("ul.sidebar-menu li a[addtabs]:not([href^='javascript:;'])").each(function () {
                        if ($("span:first", this).text().indexOf(val) > -1 || $(this).attr("py").indexOf(val) > -1 || $(this).attr("pinyin").indexOf(val) > -1) {
                            html.push('<a data-url="' + $(this).attr("href") + '" href="javascript:;">' + $("span:first", this).text() + '</a>');
                            if (html.length >= 100) {
                                return false;
                            }
                        }
                    });
                }
                $(searchResult).append(html.join(""));
                if (html.length > 0) {
                    searchResult.removeClass("hide");
                } else {
                    searchResult.addClass("hide");
                }
            });
            //快捷搜索点击事件
            $("form.sidebar-form").on('mousedown click', '.menuresult a[data-url]', function () {
                Backend.api.addtabs($(this).data("url"));
            });

            //切换左侧sidebar显示隐藏
            $(document).on("click fa.event.toggleitem", ".sidebar-menu li > a", function (e) {
                $(".sidebar-menu li").removeClass("active");
                //当外部触发隐藏的a时,触发父辈a的事件
                if (!$(this).closest("ul").is(":visible")) {
                    //如果不需要左侧的菜单栏联动可以注释下面一行即可
                    $(this).closest("ul").prev().trigger("click");
                }

                var visible = $(this).next("ul").is(":visible");
                if (!visible) {
                    $(this).parents("li").addClass("active");
                } else {
                }
                e.stopPropagation();
            });

            //全屏事件
            $(document).on('click', "[data-toggle='fullscreen']", function () {
                var doc = document.documentElement;
                if ($(document.body).hasClass("full-screen")) {
                    $(document.body).removeClass("full-screen");
                    document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
                } else {
                    $(document.body).addClass("full-screen");
                    doc.requestFullscreen ? doc.requestFullscreen() : doc.mozRequestFullScreen ? doc.mozRequestFullScreen() : doc.webkitRequestFullscreen ? doc.webkitRequestFullscreen() : doc.msRequestFullscreen && doc.msRequestFullscreen();
                }
            });

            //绑定tabs事件
            $('#nav').addtabs({iframeHeight: "100%"});

            //修复iOS下iframe无法滚动的BUG
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                $(".tab-addtabs").addClass("ios-iframe-fix");
            }

            if ($("ul.sidebar-menu li.active a").size() > 0) {
                $("ul.sidebar-menu li.active a").trigger("click");
            } else {
                $("ul.sidebar-menu li a[url!='javascript:;']:first").trigger("click");
            }

            //保留最后一次点击的窗口
            $(document).on("click", "a[addtabs]", function (e) {
                localStorage.setItem("lastpage", $(this).attr("url"));
            });
            
            //回到最后一次打开的页面
            var lastpage = localStorage.getItem("lastpage");
            if (lastpage) {
                //刷新页面后跳到到刷新前的页面
                Backend.api.addtabs(lastpage);
            }

            /**
             * List of all the available skins
             *
             * @type Array
             */
            var my_skins = [
                "skin-blue",
                "skin-black",
                "skin-red",
                "skin-yellow",
                "skin-purple",
                "skin-green",
                "skin-blue-light",
                "skin-black-light",
                "skin-red-light",
                "skin-yellow-light",
                "skin-purple-light",
                "skin-green-light"
            ];

            setup();

            /**
             * Toggles layout classes
             *
             * @param String cls the layout class to toggle
             * @returns void
             */
            function change_layout(cls) {
                $("body").toggleClass(cls);
                AdminLTE.layout.fixSidebar();
                //Fix the problem with right sidebar and layout boxed
                if (cls == "layout-boxed")
                    AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
                if ($('body').hasClass('fixed') && cls == 'fixed' && false) {
                    AdminLTE.pushMenu.expandOnHover();
                    AdminLTE.layout.activate();
                }
                AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
                AdminLTE.controlSidebar._fix($(".control-sidebar"));
            }

            /**
             * Replaces the old skin with the new skin
             * @param String cls the new skin class
             * @returns Boolean false to prevent link's default action
             */
            function change_skin(cls) {
                if (!$("body").hasClass(cls)) {
                    $.each(my_skins, function (i) {
                        $("body").removeClass(my_skins[i]);
                    });
                    cls = 'skin-blue';
                    $("body").addClass(cls);
                    store('skin', cls);
                    var cssfile = Backend.api.cdnurl("/assets/css/skins/" + cls + ".css");
                    $('head').append('<link rel="stylesheet" href="' + cssfile + '" type="text/css" />');
                }
                return false;
            }

            /**
             * Store a new settings in the browser
             *
             * @param String name Name of the setting
             * @param String val Value of the setting
             * @returns void
             */
            function store(name, val) {
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem(name, val);
                } else {
                    window.alert('Please use a modern browser to properly view this template!');
                }
            }

            /**
             * Get a prestored setting
             *
             * @param String name Name of of the setting
             * @returns String The value of the setting | null
             */
            function get(name) {
                if (typeof (Storage) !== "undefined") {
                    return localStorage.getItem(name);
                } else {
                    window.alert('Please use a modern browser to properly view this template!');
                }
            }

            /**
             * Retrieve default settings and apply them to the template
             *
             * @returns void
             */
            function setup() {
                var tmp = get('skin');
                if (tmp && $.inArray(tmp, my_skins))
                    change_skin(tmp);

                // 皮肤切换
                $("[data-skin]").on('click', function (e) {
                    if ($(this).hasClass('knob'))
                        return;
                    e.preventDefault();
                    change_skin($(this).data('skin'));
                });

                // 布局切换
                $("[data-layout]").on('click', function () {
                    change_layout($(this).data('layout'));
                });

                // 切换子菜单显示和菜单小图标的显示
                $("[data-menu]").on('click', function () {
                    if ($(this).data("menu") == 'show-submenu') {
                        $("ul.sidebar-menu").toggleClass("show-submenu");
                    } else {
                        $(".nav-addtabs").toggleClass("disable-top-badge");
                    }
                });

                // 右侧控制栏切换
                $("[data-controlsidebar]").on('click', function () {
                    change_layout($(this).data('controlsidebar'));
                    var slide = !AdminLTE.options.controlSidebarOptions.slide;
                    AdminLTE.options.controlSidebarOptions.slide = slide;
                    if (!slide)
                        $('.control-sidebar').removeClass('control-sidebar-open');
                });

                // 右侧控制栏背景切换
                $("[data-sidebarskin='toggle']").on('click', function () {
                    var sidebar = $(".control-sidebar");
                    if (sidebar.hasClass("control-sidebar-dark")) {
                        sidebar.removeClass("control-sidebar-dark")
                        sidebar.addClass("control-sidebar-light")
                    } else {
                        sidebar.removeClass("control-sidebar-light")
                        sidebar.addClass("control-sidebar-dark")
                    }
                });

                // 菜单栏展开或收起
                $("[data-enable='expandOnHover']").on('click', function () {
                    $(this).attr('disabled', true);
                    AdminLTE.pushMenu.expandOnHover();
                    if (!$('body').hasClass('sidebar-collapse'))
                        $("[data-layout='sidebar-collapse']").click();
                });

                // 重设选项
                if ($('body').hasClass('fixed')) {
                    $("[data-layout='fixed']").attr('checked', 'checked');
                }
                if ($('body').hasClass('layout-boxed')) {
                    $("[data-layout='layout-boxed']").attr('checked', 'checked');
                }
                if ($('body').hasClass('sidebar-collapse')) {
                    $("[data-layout='sidebar-collapse']").attr('checked', 'checked');
                }
                if ($('ul.sidebar-menu').hasClass('show-submenu')) {
                    $("[data-menu='show-submenu']").attr('checked', 'checked');
                }
                if ($('ul.nav-addtabs').hasClass('disable-top-badge')) {
                    $("[data-menu='disable-top-badge']").attr('checked', 'checked');
                }

            }

            $(window).resize();
        },
        //派工单
        selectSeller: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: '/index/selectSeller',
                },

            });
            var table = $("#table");
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                columns: [
                    [
                        //复选框
                        {field: 'state', radio: true, events: Controller.selectSellerApi.events.operate},
                        {field: 'id', title: '商家ID', operate: false, align: 'left'},
                        {field: 'store_name', title: '商家名称',operate: false},
                        {field: 'contacts', title: '联系人',operate: false},
                        {field: 'store_mobile', title: '联系方式',operate: false},
                        {field: 'city', title: '城市',operate:false},
                        {field: 'category_name', title: '品类',operate:false},
                        {field: 'mode', title: '分成模式', operate:false},
                    ]
                ],
                //禁用默认搜索
                search: false,
                //启用普通表单搜索
                commonSearch: false,
                //可以控制是否默认显示搜索单表,false则隐藏,默认为false
                searchFormVisible: true,
                showToggle: false,
                selectItemName:"select_store_id",

            });

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                $(".fixed-table-toolbar").remove();
            });
            // 为表格绑定事件
            Table.api.bindevent(table);
            Form.api.bindevent($("form[role=form]"));

            /**
             * 自定义搜索按钮
             */
            $(".btn-searchSeller").on('click', function(){
                var params = table.bootstrapTable('getOptions');
                params.queryParams = function(params){
                    params.keywords = $.trim($(".searchSellerKeywords").val());
                    params.city_code = $(".searchSellerCity").val();
                    params.category_id = $(".searchSellerCategory").val();

                    return params;
                }

                table.bootstrapTable('refresh', params);
            });
        },
        login: function () {
            //让错误提示框居中
            Fast.config.toastr.positionClass = "toast-top-center";

            //本地验证未通过时提示
            // $("#login-form").data("validator-options", {
            //     invalid: function (form, errors) {
            //         $.each(errors, function (i, j) {
            //             Toastr.error(j);
            //         });
            //     },
            //     target: '#errtips'
            // });
            //为表单绑定事件
            // Form.api.bindevent($("#login-form"), null, function (data) {
            //     location.href = Backend.api.fixurl(data.url);
            // });

            //按回车键登录
            $(document).keyup(function(event){
                if(event.keyCode ==13){
                    $(".btn-login").trigger("click");
                }
            });
            $(".btn-login").on("click", function(e){
                e.preventDefault();
                params = {};
                params.userName = $.trim($("input[name='userName']").val());
                params.passWord = $.trim($("input[name='passWord']").val());
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/system/login',
                    data: params,
                    success: function (res) {
                        if(res.code == 1){
                            Toastr.success(res.msg);
                            window.location.href = '/index/index';
                        }else{
                            Toastr.error(res.msg);
                        }
                    },
                    error : function(){
                        Toastr.error("网络错误,请稍后重试");
                    }
                });
            });
        },
        selectSellerApi: {
            events: {//绑定事件的方法
                operate: $.extend({
                    'click input[name="select_store_id"]': function (e, value, row, index) {
                        e.stopPropagation();
                        parent.$('input[name="store_name"]').val(row.store_name);
                        parent.$('input[name="order[store_id]"]').val(row.id);
                        var index = parent.Layer.getFrameIndex(window.name);
                        parent.Layer.close(index);
                    }
                }, Table.api.events.operate)
            }
        },

    };

    return Controller;
});