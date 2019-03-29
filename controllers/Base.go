package controllers

import "github.com/astaxie/beego"

/**
	gocrm 控制器父类
 */
type BaseController struct {
	beego.Controller
}

/**
	初始化方法
 */
func (this *BaseController)  init(){

}

/**
	检测登录
 */
func (this *BaseController) checkLogin(){

}
