package controllers

import (
	"fmt"
	"gocrm/services"
)

type IndexController struct{
	BaseController
}

func (this *IndexController) Index(){
	this.Data["title"] = "首页"
	fmt.Println(this.UserInfo.Role_id)
	services.HookMenus("10")
	//fmt.Println(menulist)
	this.TplName = "index/index.html"
}

//首页控制台
func (this *IndexController) Home(){
	this.Data["title"] = "控制台"
	this.TplName = "index/home.html"
}
