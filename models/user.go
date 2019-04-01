package models

import (
	"github.com/astaxie/beego/orm"
)

func init() {
	// 需要在init中注册定义的model
	orm.RegisterModel(new(User))
}

type User struct{
	Id int
	Account string
	Name string
	Password string
	Role_id string
	Status int
	Org_id int
}

func (u *User) TableName() string {
	// db table name
	return GetTableName("user")
}
//通过用户名获取用户信息
func UserInfoGetByName(username string) (*User, error) {
	m := new(User)
	err := orm.NewOrm().QueryTable(GetTableName("user")).Filter("name", username).One(m)
	if err != nil{
		return nil,err
	}
	return m, nil
}

/**
	获取用户列表
 */
func UserGetPageList(where string, offset,pageSize int, orderby string) ([]*User, int64){
	list := make([]*User, 0)
	query := orm.NewOrm().QueryTable(GetTableName("user"))

	total,_ := query.Count()
	query.OrderBy(orderby).Limit(pageSize, offset).All(&list)

	return list, total
}

