package controllers

type IndexController struct{
	BaseController
}

func (this *IndexController) Index(){

	this.Data["title"] = "首页"
	this.TplName = "index/index.html"
}
