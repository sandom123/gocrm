package controllers

type IndexController struct{
	BaseController
}

func (this *IndexController) Index(){
	this.Data["title"] = "首页"
	this.TplName = "index/index.html"
}

//首页控制台
func (this *IndexController) Home(){
	this.Data["title"] = "控制台"
	this.TplName = "index/home.html"
}
