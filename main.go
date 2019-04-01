package main

import (
	_ "gocrm/routers"
	"github.com/astaxie/beego"
	"gocrm/models"
)

func main() {
	models.Init() //初始化数据库配置
	beego.SetStaticPath("/assets", "assets")
	beego.Run()
}
