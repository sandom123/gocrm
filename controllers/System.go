package controllers

type SystemController struct{
	BaseController
}

/**
	登录
 */
func (this *SystemController) Login(){
	this.Data["title"] = "百合婚礼CRM系统"
	this.TplName = "system/login.html"
}

