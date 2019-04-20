package routers

import (
	"gocrm/controllers"
	"github.com/astaxie/beego"
)

/**
	路由规则
 */
func init() {
	beego.Router("", &controllers.IndexController{}, "*:Index")
	//beego.Router("system/login", &controllers.SystemController{}, "*:Login")
	//beego.Router("index/index", &controllers.IndexController{}, "*:Index")
	//beego.Router("index/home", &controllers.IndexController{}, "*:Home")
	//beego.Router("User/list", &controllers.UserController{}, "*:List")
	//beego.Router("user/list", &controllers.UserController{}, "*:List")

	//后台管理
	beego.AutoRouter(&controllers.SystemController{})
	beego.AutoRouter(&controllers.IndexController{})
	beego.AutoRouter(&controllers.UserController{})
	beego.AutoRouter(&controllers.ArticleController{})
	//beego.ErrorController(&controllers.ErrorController{})
}
