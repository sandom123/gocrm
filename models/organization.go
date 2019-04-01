package models

import "github.com/astaxie/beego/orm"

func init() {
	// 需要在init中注册定义的model
	orm.RegisterModel(new(Organization))
}

type Organization struct{
	Id int
	Name string
	Sign string
	Pid int
	Status int
}

//获取组织列表
func (o *Organization)GetList()  {

}



