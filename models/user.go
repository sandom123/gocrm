package models

import "github.com/astaxie/beego/orm"

var (
	TableName = "user"
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
	Role_id int
	Status int
	Org_id int
}

func (u *User) TableName() string {
	// db table name
	return GetTableName(TableName)
}
//通过用户名获取用户信息
func UserInfoGetByName(username string) (*User, error) {
	m := new(User)
	err := orm.NewOrm().QueryTable(GetTableName(TableName)).Filter("name", username).One(m)
	if err != nil{
		return nil,err
	}
	return m, nil
}
