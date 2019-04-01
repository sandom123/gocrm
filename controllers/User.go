package controllers

import (
	"gocrm/models"
	"strconv"
	_"fmt"
)

//用户控制器
type UserController struct{
	BaseController
}

//用户列表
func (this *UserController) List() {

	pageSize,_ := strconv.Atoi(this.GetString("limit"))
	offset,_ := strconv.Atoi(this.GetString("offset"))
	where := ""
	list, count :=models.UserGetPageList(where, pageSize, offset, "-Id")
	data := make(map[string]interface{})
	data["rows"] = list
	data["total"] = count
	if this.IsAjax(){
		this.Data["json"] = data
		this.ServeJSON()
		//this.jsonOutput(1, "", data)
	}
	this.TplName = "user/list.html"
}


