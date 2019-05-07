package models

import (
	"github.com/astaxie/beego/orm"
)

func init() {
	// 需要在init中注册定义的model
	orm.RegisterModel(new(Menu))
}

//组织
type Organization struct{
	Id int
	Name string
	Sign string
	Pid int
	Status int
}

//菜单
type Menu struct{
	Id int
	Ismenu int
	Name string
	Code string
	Pid int
	Icon string
	Weigh int
	Status string
}

//获取组织列表
func (o *Organization)GetList()  {

}

func (u *Menu) TableName() string {
	// db table name
	return GetTableName("menu")
}

func GetMenuList(where string, order string, offset, limit int)  []*Menu{
	list := make([]*Menu, 0)
	query := orm.NewOrm().QueryTable(GetTableName("menu"))
	//Filter(where)
	query.Filter("ismenu", 1)
	query.Filter("status", "normal")
	query.OrderBy(order).Limit(limit, offset).All(&list)

	return list
}


