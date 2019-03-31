package libary

import (
	"crypto/md5"
	"fmt"
	"github.com/astaxie/beego"
)

//生成用户密码
func CreateUserPassword(password string) string{
	firstMd5 := Md5(password) + beego.AppConfig.String("UserPasswordSalt")

	return Md5(firstMd5)
}

//Md5
func Md5(password string)  string{
	bytePassword := []byte(password)
	hash := md5.New()
	hash.Write(bytePassword)
	return fmt.Sprintf("%x", hash.Sum(nil))
}
