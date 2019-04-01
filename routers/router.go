package routers

import (
	"gocrm/controllers"
	"github.com/astaxie/beego"
)

/**
	路由规则
 */
func init() {
    beego.Router("System/login", &controllers.SystemController{}, "*:Login")
	beego.Router("system/login", &controllers.SystemController{}, "*:Login")
	beego.Router("index/index", &controllers.IndexController{}, "*:Index")
	beego.Router("index/home", &controllers.IndexController{}, "*:Home")
	beego.Router("User/list", &controllers.UserController{}, "*:List")

}
