package main

import (
	_ "gocrm/routers"
	"github.com/astaxie/beego"
)

func main() {

	beego.SetStaticPath("/assets", "assets")
	beego.Run()
}

