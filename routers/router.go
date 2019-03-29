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
}
