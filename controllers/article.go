package controllers

import (
	_"fmt"
)

//用户控制器
type ArticleController struct{
	BaseController
}

//文章列表
func (this *ArticleController) List(){
	this.Ctx.WriteString("文章列表")
}


